import { supabase } from '@/integrations/supabase/client';

export class DataSeedingService {
  static async seedSampleData() {
    console.log('🌱 Starting data seeding...');
    
    try {
      // Create sample teacher profiles
      const teacherProfiles = [
        {
          id: 'teacher-1',
          email: 'teacher1@example.com',
          full_name: 'Анна Петрова',
          role: 'teacher' as const,
          specialization: 'Математика',
          experience_years: 5,
          education: 'Кыргызский государственный университет',
          languages: ['Русский', 'Кыргызский', 'Английский'],
          skills: ['Преподавание', 'Разработка учебных программ'],
          location: 'Бишкек',
          bio: 'Опытный преподаватель математики с 5-летним стажем работы',
          is_published: true,
          is_profile_complete: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'teacher-2',
          email: 'teacher2@example.com',
          full_name: 'Марат Алиев',
          role: 'teacher' as const,
          specialization: 'Английский язык',
          experience_years: 8,
          education: 'Американский университет в Центральной Азии',
          languages: ['Английский', 'Русский', 'Кыргызский'],
          skills: ['Преподавание', 'Подготовка к экзаменам'],
          location: 'Бишкек',
          bio: 'Сертифицированный преподаватель английского языка',
          is_published: true,
          is_profile_complete: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'teacher-3',
          email: 'teacher3@example.com',
          full_name: 'Гульмира Садыкова',
          role: 'teacher' as const,
          specialization: 'Физика',
          experience_years: 12,
          education: 'Кыргызский технический университет',
          languages: ['Кыргызский', 'Русский'],
          skills: ['Преподавание', 'Научная работа'],
          location: 'Ош',
          bio: 'Доктор физико-математических наук, опытный педагог',
          is_published: true,
          is_profile_complete: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      // Create sample school profiles
      const schoolProfiles = [
        {
          id: 'school-1',
          email: 'school1@example.com',
          full_name: 'Школа №1',
          role: 'school' as const,
          school_name: 'Школа №1 имени А.С. Пушкина',
          school_type: 'Средняя школа',
          school_description: 'Одна из старейших школ Бишкека с богатой историей',
          school_address: 'ул. Советская, 123, Бишкек',
          facilities: ['Спортивный зал', 'Библиотека', 'Компьютерный класс'],
          founded_year: 1935,
          student_count: 450,
          is_published: true,
          is_profile_complete: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'school-2',
          email: 'school2@example.com',
          full_name: 'Гимназия №2',
          role: 'school' as const,
          school_name: 'Гимназия №2 с углубленным изучением английского языка',
          school_type: 'Гимназия',
          school_description: 'Современная гимназия с углубленным изучением иностранных языков',
          school_address: 'ул. Московская, 45, Бишкек',
          facilities: ['Лингвистическая лаборатория', 'Спортивная площадка', 'Столовая'],
          founded_year: 1995,
          student_count: 320,
          is_published: true,
          is_profile_complete: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'school-3',
          email: 'school3@example.com',
          full_name: 'Лицей №3',
          role: 'school' as const,
          school_name: 'Лицей №3 с физико-математическим уклоном',
          school_type: 'Лицей',
          school_description: 'Специализированный лицей для одаренных детей',
          school_address: 'ул. Ленина, 78, Бишкек',
          facilities: ['Физическая лаборатория', 'Математический кабинет', 'Актовый зал'],
          founded_year: 2005,
          student_count: 280,
          is_published: true,
          is_profile_complete: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      // Insert teacher profiles
      console.log('📝 Inserting teacher profiles...');
      for (const teacher of teacherProfiles) {
        const { error } = await supabase
          .from('profiles')
          .upsert(teacher, { onConflict: 'id' });
        
        if (error) {
          console.error('❌ Error inserting teacher:', teacher.id, error);
        } else {
          console.log('✅ Inserted teacher:', teacher.full_name);
        }
      }

      // Insert school profiles
      console.log('📝 Inserting school profiles...');
      for (const school of schoolProfiles) {
        const { error } = await supabase
          .from('profiles')
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
        .from('profiles')
        .select('*')
        .eq('role', 'teacher')
        .eq('is_published', true);

      const { data: schools, error: schoolError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'school')
        .eq('is_published', true);

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
      const { error } = await supabase
        .from('profiles')
        .delete()
        .in('id', [
          'teacher-1', 'teacher-2', 'teacher-3',
          'school-1', 'school-2', 'school-3'
        ]);

      if (error) {
        console.error('❌ Error clearing data:', error);
        return { success: false, error };
      }

      console.log('✅ Sample data cleared!');
      return { success: true };
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      return { success: false, error };
    }
  }
} 