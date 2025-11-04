-- Rename user_profiles table to profiles
DO $$ 
BEGIN
    -- First, check if user_profiles exists and profiles doesn't
    IF EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'user_profiles'
    ) AND NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles'
    ) THEN
        -- Drop existing triggers if any
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        
        -- Rename the table
        ALTER TABLE public.user_profiles RENAME TO profiles;
        
        -- Recreate the trigger with the new table name
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.profiles (
                id, 
                name, 
                role,
                business_registration_number,
                license_number,
                manager_names
            )
            VALUES (
                NEW.id, 
                NEW.raw_user_meta_data->>'name', 
                COALESCE(NEW.raw_user_meta_data->>'role', 'renter'),
                NEW.raw_user_meta_data->>'business_registration_number',
                NEW.raw_user_meta_data->>'license_number',
                NEW.raw_user_meta_data->>'manager_names'
            );
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Recreate the trigger
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
            
        -- Update RLS policies to use the new table name
        DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
        DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
        DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
        DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

        -- Recreate policies for the renamed table
        CREATE POLICY "Users can view their own profile" 
        ON public.profiles 
        FOR SELECT 
        USING (id = auth.uid());

        CREATE POLICY "Users can update their own profile" 
        ON public.profiles 
        FOR UPDATE 
        USING (id = auth.uid());

        CREATE POLICY "Admins can view all profiles" 
        ON public.profiles 
        FOR SELECT 
        USING (
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role = 'admin'
            )
        );

        CREATE POLICY "Admins can update all profiles" 
        ON public.profiles 
        FOR UPDATE 
        USING (
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role = 'admin'
            )
        );
    END IF;
END $$;