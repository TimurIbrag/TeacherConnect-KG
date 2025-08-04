import { supabase } from '@/integrations/supabase/client';

export class DataSeedingService {
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
        .in('id', ['teacher-1', 'teacher-2', 'teacher-3']);

      if (teacherError) {
        console.error('❌ Error clearing teacher data:', teacherError);
      }

      // Clear school profiles
      const { error: schoolError } = await supabase
        .from('school_profiles')
        .delete()
        .in('id', ['school-1', 'school-2', 'school-3']);

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