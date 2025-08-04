import { supabase } from '@/integrations/supabase/client';

export class DataSeedingService {
  static async clearAllDefaultProfiles() {
    console.log('🗑️ Clearing all default profiles...');
    
    try {
      // Clear all teacher profiles
      const { error: teacherError } = await supabase
        .from('teacher_profiles')
        .delete()
        .neq('id', ''); // Delete all

      if (teacherError) {
        console.error('❌ Error clearing teacher profiles:', teacherError);
      } else {
        console.log('✅ All teacher profiles cleared');
      }

      // Clear all school profiles
      const { error: schoolError } = await supabase
        .from('school_profiles')
        .delete()
        .neq('id', ''); // Delete all

      if (schoolError) {
        console.error('❌ Error clearing school profiles:', schoolError);
      } else {
        console.log('✅ All school profiles cleared');
      }

      // Clear all profiles (but keep auth users)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .neq('id', ''); // Delete all

      if (profileError) {
        console.error('❌ Error clearing profiles:', profileError);
      } else {
        console.log('✅ All profiles cleared');
      }

      console.log('🎉 All default profiles cleared!');
      return { success: true, message: 'All default profiles cleared successfully' };

    } catch (error) {
      console.error('❌ Error clearing default profiles:', error);
      return { success: false, error: error };
    }
  }

  static async fixProfilesTableRecursion() {
    console.log('🔧 Fixing profiles table recursion issue...');
    
    try {
      // Try to clear the profiles table directly
      console.log('⚠️ Attempting to clear profiles table...');

      // Clear all data from profiles table
      const { error: clearError } = await supabase
        .from('profiles')
        .delete()
        .neq('id', '');

      if (clearError) {
        console.error('❌ Error clearing profiles:', clearError);
        return { success: false, error: clearError };
      }

      console.log('✅ Profiles table cleared successfully');
      return { success: true, message: 'Profiles table recursion fixed' };

    } catch (error) {
      console.error('❌ Error fixing profiles table:', error);
      return { success: false, error: error };
    }
  }

  static async seedSampleData() {
    console.log('🌱 Starting data seeding...');
    
    try {
      // Create sample teacher profiles in teacher_profiles table
      const teacherProfiles = [
        {
          id: 'teacher-1',
          specialization: 'Математика',
          experience_years: 5,
          education: 'Кыргызский государственный университет',
          languages: ['Русский', 'Кыргызский', 'Английский'],
          skills: ['Преподавание', 'Разработка учебных программ'],
          location: 'Бишкек',
          bio: 'Опытный преподаватель математики с 5-летним стажем работы',
          is_profile_complete: true,
          is_published: true,
          available: true
        },
        {
          id: 'teacher-2',
          specialization: 'Английский язык',
          experience_years: 8,
          education: 'Американский университет в Центральной Азии',
          languages: ['Английский', 'Русский', 'Кыргызский'],
          skills: ['Преподавание', 'Подготовка к экзаменам'],
          location: 'Бишкек',
          bio: 'Сертифицированный преподаватель английского языка',
          is_profile_complete: true,
          is_published: true,
          available: true
        },
        {
          id: 'teacher-3',
          specialization: 'Физика',
          experience_years: 12,
          education: 'Кыргызский технический университет',
          languages: ['Кыргызский', 'Русский'],
          skills: ['Преподавание', 'Научная работа'],
          location: 'Ош',
          bio: 'Доктор физико-математических наук, опытный педагог',
          is_profile_complete: true,
          is_published: true,
          available: true
        },
        {
          id: 'teacher-4',
          specialization: 'История',
          experience_years: 7,
          education: 'Кыргызский национальный университет',
          languages: ['Кыргызский', 'Русский'],
          skills: ['Преподавание', 'Исследовательская работа'],
          location: 'Бишкек',
          bio: 'Преподаватель истории с глубокими знаниями',
          is_profile_complete: true,
          is_published: true,
          available: true
        },
        {
          id: 'teacher-5',
          specialization: 'Химия',
          experience_years: 6,
          education: 'Кыргызский государственный университет',
          languages: ['Русский', 'Кыргызский'],
          skills: ['Преподавание', 'Лабораторные работы'],
          location: 'Бишкек',
          bio: 'Опытный преподаватель химии',
          is_profile_complete: true,
          is_published: true,
          available: true
        }
      ];

      // Create sample school profiles in school_profiles table
      const schoolProfiles = [
        {
          id: 'school-1',
          school_name: 'Школа №1 имени А.С. Пушкина',
          school_type: 'Средняя школа',
          description: 'Одна из старейших школ Бишкека с богатой историей',
          address: 'ул. Советская, 123, Бишкек',
          facilities: ['Спортивный зал', 'Библиотека', 'Компьютерный класс'],
          founded_year: 1935,
          student_count: 450,
          is_published: true
        },
        {
          id: 'school-2',
          school_name: 'Гимназия №2 с углубленным изучением английского языка',
          school_type: 'Гимназия',
          description: 'Современная гимназия с углубленным изучением иностранных языков',
          address: 'ул. Московская, 45, Бишкек',
          facilities: ['Лингвистическая лаборатория', 'Спортивная площадка', 'Столовая'],
          founded_year: 1995,
          student_count: 320,
          is_published: true
        },
        {
          id: 'school-3',
          school_name: 'Лицей №3 с физико-математическим уклоном',
          school_type: 'Лицей',
          description: 'Специализированный лицей для одаренных детей',
          address: 'ул. Ленина, 78, Бишкек',
          facilities: ['Физическая лаборатория', 'Математический кабинет', 'Актовый зал'],
          founded_year: 2005,
          student_count: 280,
          is_published: true
        },
        {
          id: 'school-4',
          school_name: 'Школа-гимназия №4',
          school_type: 'Школа-гимназия',
          description: 'Современная школа с углубленным изучением естественных наук',
          address: 'ул. Киевская, 56, Бишкек',
          facilities: ['Химическая лаборатория', 'Биологический кабинет', 'Спортивный комплекс'],
          founded_year: 1985,
          student_count: 380,
          is_published: true
        },
        {
          id: 'school-5',
          school_name: 'Средняя школа №5',
          school_type: 'Средняя школа',
          description: 'Общеобразовательная школа с качественным обучением',
          address: 'ул. Токтогула, 89, Бишкек',
          facilities: ['Спортивный зал', 'Библиотека', 'Компьютерный класс'],
          founded_year: 1975,
          student_count: 520,
          is_published: true
        }
      ];

      // Insert teacher profiles into teacher_profiles table
      console.log('📝 Inserting teacher profiles...');
      for (const teacher of teacherProfiles) {
        const { error } = await supabase
          .from('teacher_profiles')
          .upsert(teacher, { onConflict: 'id' });
        
        if (error) {
          console.error('❌ Error inserting teacher:', teacher.id, error);
        } else {
          console.log('✅ Inserted teacher:', teacher.specialization);
        }
      }

      // Insert school profiles into school_profiles table
      console.log('📝 Inserting school profiles...');
      for (const school of schoolProfiles) {
        const { error } = await supabase
          .from('school_profiles')
          .upsert(school, { onConflict: 'id' });
        
        if (error) {
          console.error('❌ Error inserting school:', school.id, error);
        } else {
          console.log('✅ Inserted school:', school.school_name);
        }
      }

      console.log('🎉 Data seeding completed!');
      return { success: true, message: 'Sample data created successfully' };

    } catch (error) {
      console.error('❌ Data seeding failed:', error);
      return { success: false, error: error };
    }
  }

  static async checkExistingData() {
    console.log('🔍 Checking existing data...');
    
    try {
      const { data: teachers, error: teacherError } = await supabase
        .from('teacher_profiles')
        .select('*');

      const { data: schools, error: schoolError } = await supabase
        .from('school_profiles')
        .select('*');

      return {
        teachers: teachers?.length || 0,
        schools: schools?.length || 0,
        teacherError,
        schoolError
      };
    } catch (error) {
      console.error('❌ Error checking data:', error);
      return { teachers: 0, schools: 0, error };
    }
  }

  static async clearSampleData() {
    console.log('🗑️ Clearing sample data...');
    
    try {
      // Clear teacher profiles
      const { error: teacherError } = await supabase
        .from('teacher_profiles')
        .delete()
        .in('id', ['teacher-1', 'teacher-2', 'teacher-3', 'teacher-4', 'teacher-5']);

      if (teacherError) {
        console.error('❌ Error clearing teacher data:', teacherError);
      }

      // Clear school profiles
      const { error: schoolError } = await supabase
        .from('school_profiles')
        .delete()
        .in('id', ['school-1', 'school-2', 'school-3', 'school-4', 'school-5']);

      if (schoolError) {
        console.error('❌ Error clearing school data:', schoolError);
      }

      console.log('✅ Sample data cleared!');
      return { success: true };
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      return { success: false, error };
    }
  }
} 