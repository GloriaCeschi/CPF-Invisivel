export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      banks: {
        Row: {
          cnpj: string | null
          created_at: string
          credit: string | null
          id: string
          interest: number | null
          max_amount: number | null
          max_term: number | null
          name: string | null
          user_id: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          credit?: string | null
          id?: string
          interest?: number | null
          max_amount?: number | null
          max_term?: number | null
          name?: string | null
          user_id: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          credit?: string | null
          id?: string
          interest?: number | null
          max_amount?: number | null
          max_term?: number | null
          name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bills: {
        Row: {
          amount: number
          created_at: string
          current_installment: number
          description: string | null
          id: string
          next_due_date: string | null
          payment_date: string
          receipt_url: string | null
          status: string
          title: string
          total_installments: number
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          current_installment?: number
          description?: string | null
          id?: string
          next_due_date?: string | null
          payment_date?: string
          receipt_url?: string | null
          status?: string
          title: string
          total_installments?: number
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          current_installment?: number
          description?: string | null
          id?: string
          next_due_date?: string | null
          payment_date?: string
          receipt_url?: string | null
          status?: string
          title?: string
          total_installments?: number
          user_id?: string
        }
        Relationships: []
      }
      classes: {
        Row: {
          certificate: string | null
          created_at: string
          id: string
          id_courses: string
          id_user: string
        }
        Insert: {
          certificate?: string | null
          created_at?: string
          id?: string
          id_courses: string
          id_user: string
        }
        Update: {
          certificate?: string | null
          created_at?: string
          id?: string
          id_courses?: string
          id_user?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string | null
          class: string | null
          created_at: string
          description: string | null
          id: number
          lock_reason: string | null
          locked: boolean | null
          points: number | null
          progress: number
          title: string
        }
        Insert: {
          category?: string | null
          class?: string | null
          created_at?: string
          description?: string | null
          id?: number
          lock_reason?: string | null
          locked?: boolean | null
          points?: number | null
          progress?: number
          title: string
        }
        Update: {
          category?: string | null
          class?: string | null
          created_at?: string
          description?: string | null
          id?: number
          lock_reason?: string | null
          locked?: boolean | null
          points?: number | null
          progress?: number
          title?: string
        }
        Relationships: []
      }
      incomes: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          receipt_type: string
          receipt_url: string | null
          recorded_at: string
          title: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          receipt_type?: string
          receipt_url?: string | null
          recorded_at?: string
          title: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          receipt_type?: string
          receipt_url?: string | null
          recorded_at?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          archived: boolean | null
          created_at: string
          id: string
          key_id: string | null
          message: string | null
          type: string | null
          user_id: string | null
          viewed: boolean | null
        }
        Insert: {
          archived?: boolean | null
          created_at?: string
          id?: string
          key_id?: string | null
          message?: string | null
          type?: string | null
          user_id?: string | null
          viewed?: boolean | null
        }
        Update: {
          archived?: boolean | null
          created_at?: string
          id?: string
          key_id?: string | null
          message?: string | null
          type?: string | null
          user_id?: string | null
          viewed?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: string | null
          birth: string | null
          city: string | null
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string
          photo_url: string | null
          roles: string
          senha_hash: string | null
          state: string | null
          user_id: string | null
        }
        Insert: {
          age?: string | null
          birth?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone: string
          photo_url?: string | null
          roles?: string
          senha_hash?: string | null
          state?: string | null
          user_id?: string | null
        }
        Update: {
          age?: string | null
          birth?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string
          photo_url?: string | null
          roles?: string
          senha_hash?: string | null
          state?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      proofs: {
        Row: {
          created_at: string
          description: string | null
          feedback: string | null
          id: string
          points: number | null
          proof: string
          status: string | null
          type: string | null
          update_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          feedback?: string | null
          id?: string
          points?: number | null
          proof: string
          status?: string | null
          type?: string | null
          update_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          feedback?: string | null
          id?: string
          points?: number | null
          proof?: string
          status?: string | null
          type?: string | null
          update_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          credit_limit: string | null
          id: string
          interest_rate: string | null
          service: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          credit_limit?: string | null
          id?: string
          interest_rate?: string | null
          service?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          credit_limit?: string | null
          id?: string
          interest_rate?: string | null
          service?: string | null
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          course_id: number | null
          created_at: string | null
          id: string
          thumbnail_url: string | null
          title: string | null
          video_url: string
        }
        Insert: {
          course_id?: number | null
          created_at?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string | null
          video_url: string
        }
        Update: {
          course_id?: number | null
          created_at?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
