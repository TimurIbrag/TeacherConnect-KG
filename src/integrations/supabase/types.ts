export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applied_at: string | null
          cover_letter: string | null
          id: string
          notes: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          teacher_id: string
          vacancy_id: string
        }
        Insert: {
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          teacher_id: string
          vacancy_id: string
        }
        Update: {
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          teacher_id?: string
          vacancy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_vacancy_id_fkey"
            columns: ["vacancy_id"]
            isOneToOne: false
            referencedRelation: "vacancies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_applications_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_applications_vacancy"
            columns: ["vacancy_id"]
            isOneToOne: false
            referencedRelation: "vacancies"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_room_id: string
          created_at: string
          id: string
          read: boolean
          sender_id: string
          text: string
        }
        Insert: {
          chat_room_id: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id: string
          text: string
        }
        Update: {
          chat_room_id?: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          id: string
          participant_a: string
          participant_b: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          participant_a: string
          participant_b: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          participant_a?: string
          participant_b?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_participant_a_fkey"
            columns: ["participant_a"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_rooms_participant_b_fkey"
            columns: ["participant_b"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          application_id: string | null
          content: string
          id: string
          read: boolean | null
          recipient_id: string
          sender_id: string
          sent_at: string | null
          subject: string | null
        }
        Insert: {
          application_id?: string | null
          content: string
          id?: string
          read?: boolean | null
          recipient_id: string
          sender_id: string
          sent_at?: string | null
          subject?: string | null
        }
        Update: {
          application_id?: string | null
          content?: string
          id?: string
          read?: boolean | null
          recipient_id?: string
          sender_id?: string
          sent_at?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_messages_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_messages_recipient"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_messages_sender"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_notifications_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_views: {
        Row: {
          id: string
          ip_address: unknown | null
          profile_id: string
          profile_type: string
          user_agent: string | null
          view_timestamp: string | null
          viewer_id: string | null
        }
        Insert: {
          id?: string
          ip_address?: unknown | null
          profile_id: string
          profile_type: string
          user_agent?: string | null
          view_timestamp?: string | null
          viewer_id?: string | null
        }
        Update: {
          id?: string
          ip_address?: unknown | null
          profile_id?: string
          profile_type?: string
          user_agent?: string | null
          view_timestamp?: string | null
          viewer_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          last_seen_at?: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          last_seen_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          last_seen_at?: string | null
        }
        Relationships: []
      }
      school_profiles: {
        Row: {
          address: string | null
          description: string | null
          facilities: string[] | null
          founded_year: number | null
          housing_provided: boolean | null
          id: string
          is_published: boolean | null
          latitude: number | null
          location_verified: boolean | null
          longitude: number | null
          photo_urls: string[] | null
          school_name: string
          school_type: string | null
          student_count: number | null
          verification_documents: string[] | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          view_count: number | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          description?: string | null
          facilities?: string[] | null
          founded_year?: number | null
          housing_provided?: boolean | null
          id: string
          is_published?: boolean | null
          latitude?: number | null
          location_verified?: boolean | null
          longitude?: number | null
          photo_urls?: string[] | null
          school_name: string
          school_type?: string | null
          student_count?: number | null
          verification_documents?: string[] | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          view_count?: number | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          description?: string | null
          facilities?: string[] | null
          founded_year?: number | null
          housing_provided?: boolean | null
          id?: string
          is_published?: boolean | null
          latitude?: number | null
          location_verified?: boolean | null
          longitude?: number | null
          photo_urls?: string[] | null
          school_name?: string
          school_type?: string | null
          student_count?: number | null
          verification_documents?: string[] | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          view_count?: number | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_profiles: {
        Row: {
          available: boolean | null
          bio: string | null
          certificates: string[] | null
          cv_url: string | null
          date_of_birth: string | null
          education: string | null
          experience_years: number | null
          id: string
          is_profile_complete: boolean | null
          is_published: boolean | null
          languages: Json | null
          location: string | null
          resume_url: string | null
          schedule_details: Json | null
          skills: string[] | null
          specialization: string | null
          verification_documents: string[] | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          view_count: number | null
        }
        Insert: {
          available?: boolean | null
          bio?: string | null
          certificates?: string[] | null
          cv_url?: string | null
          date_of_birth?: string | null
          education?: string | null
          experience_years?: number | null
          id: string
          is_profile_complete?: boolean | null
          is_published?: boolean | null
          languages?: Json | null
          location?: string | null
          resume_url?: string | null
          schedule_details?: Json | null
          skills?: string[] | null
          specialization?: string | null
          verification_documents?: string[] | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          view_count?: number | null
        }
        Update: {
          available?: boolean | null
          bio?: string | null
          certificates?: string[] | null
          cv_url?: string | null
          date_of_birth?: string | null
          education?: string | null
          experience_years?: number | null
          id?: string
          is_profile_complete?: boolean | null
          is_published?: boolean | null
          languages?: Json | null
          location?: string | null
          resume_url?: string | null
          schedule_details?: Json | null
          skills?: string[] | null
          specialization?: string | null
          verification_documents?: string[] | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_vacancies: {
        Row: {
          availability: string[] | null
          created_at: string
          description: string | null
          employment_type: string | null
          experience_required: number | null
          group_rate: number | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          languages: string[] | null
          location: string | null
          subject: string | null
          teacher_id: string
          title: string
          updated_at: string
        }
        Insert: {
          availability?: string[] | null
          created_at?: string
          description?: string | null
          employment_type?: string | null
          experience_required?: number | null
          group_rate?: number | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          languages?: string[] | null
          location?: string | null
          subject?: string | null
          teacher_id: string
          title: string
          updated_at?: string
        }
        Update: {
          availability?: string[] | null
          created_at?: string
          description?: string | null
          employment_type?: string | null
          experience_required?: number | null
          group_rate?: number | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          languages?: string[] | null
          location?: string | null
          subject?: string | null
          teacher_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_teacher_vacancies_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_vacancies_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vacancies: {
        Row: {
          application_deadline: string | null
          benefits: string[] | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          employment_type: string | null
          experience_required: number | null
          housing_provided: boolean | null
          id: string
          is_active: boolean | null
          location: string | null
          requirements: string[] | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          school_id: string
          subject: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_deadline?: string | null
          benefits?: string[] | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          employment_type?: string | null
          experience_required?: number | null
          housing_provided?: boolean | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          requirements?: string[] | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          school_id: string
          subject?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_deadline?: string | null
          benefits?: string[] | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          employment_type?: string | null
          experience_required?: number | null
          housing_provided?: boolean | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          requirements?: string[] | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          school_id?: string
          subject?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vacancies_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vacancies_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: string
      }
      increment_profile_views: {
        Args: {
          profile_id_param: string
          profile_type_param: string
          viewer_id_param?: string
          ip_address_param?: unknown
          user_agent_param?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      application_status: "pending" | "reviewed" | "accepted" | "rejected"
      user_role: "teacher" | "school" | "admin"
      verification_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: ["pending", "reviewed", "accepted", "rejected"],
      user_role: ["teacher", "school", "admin"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
