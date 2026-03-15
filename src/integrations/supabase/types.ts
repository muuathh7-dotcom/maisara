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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          adults: number
          booking_reference: string
          booking_status: string | null
          children: number
          created_at: string
          customer_email: string
          customer_fingerprint: string | null
          customer_ip: string | null
          customer_language: string | null
          customer_name: string
          customer_phone: string
          customer_screen_resolution: string | null
          customer_timezone: string | null
          customer_user_agent: string | null
          departure_city: string
          departure_date: string
          extra_luggage: boolean | null
          id: string
          package_name: string
          package_price: number
          payment_method: string | null
          payment_status: string | null
          pre_booking_id: string | null
          return_date: string
          room_type: string
          savings: number | null
          total_price: number
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          wheelchair_service: boolean | null
        }
        Insert: {
          adults?: number
          booking_reference?: string
          booking_status?: string | null
          children?: number
          created_at?: string
          customer_email: string
          customer_fingerprint?: string | null
          customer_ip?: string | null
          customer_language?: string | null
          customer_name: string
          customer_phone: string
          customer_screen_resolution?: string | null
          customer_timezone?: string | null
          customer_user_agent?: string | null
          departure_city: string
          departure_date: string
          extra_luggage?: boolean | null
          id?: string
          package_name: string
          package_price: number
          payment_method?: string | null
          payment_status?: string | null
          pre_booking_id?: string | null
          return_date: string
          room_type: string
          savings?: number | null
          total_price: number
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wheelchair_service?: boolean | null
        }
        Update: {
          adults?: number
          booking_reference?: string
          booking_status?: string | null
          children?: number
          created_at?: string
          customer_email?: string
          customer_fingerprint?: string | null
          customer_ip?: string | null
          customer_language?: string | null
          customer_name?: string
          customer_phone?: string
          customer_screen_resolution?: string | null
          customer_timezone?: string | null
          customer_user_agent?: string | null
          departure_city?: string
          departure_date?: string
          extra_luggage?: boolean | null
          id?: string
          package_name?: string
          package_price?: number
          payment_method?: string | null
          payment_status?: string | null
          pre_booking_id?: string | null
          return_date?: string
          room_type?: string
          savings?: number | null
          total_price?: number
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wheelchair_service?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_pre_booking_id_fkey"
            columns: ["pre_booking_id"]
            isOneToOne: false
            referencedRelation: "pre_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_bookings: {
        Row: {
          adults: number | null
          children: number | null
          created_at: string
          customer_fingerprint: string | null
          customer_ip: string | null
          customer_language: string | null
          customer_screen_resolution: string | null
          customer_timezone: string | null
          customer_user_agent: string | null
          departure_date: string | null
          extra_luggage: boolean | null
          id: string
          package_id: string
          package_name: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          wheelchair_service: boolean | null
        }
        Insert: {
          adults?: number | null
          children?: number | null
          created_at?: string
          customer_fingerprint?: string | null
          customer_ip?: string | null
          customer_language?: string | null
          customer_screen_resolution?: string | null
          customer_timezone?: string | null
          customer_user_agent?: string | null
          departure_date?: string | null
          extra_luggage?: boolean | null
          id?: string
          package_id: string
          package_name: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wheelchair_service?: boolean | null
        }
        Update: {
          adults?: number | null
          children?: number | null
          created_at?: string
          customer_fingerprint?: string | null
          customer_ip?: string | null
          customer_language?: string | null
          customer_screen_resolution?: string | null
          customer_timezone?: string | null
          customer_user_agent?: string | null
          departure_date?: string | null
          extra_luggage?: boolean | null
          id?: string
          package_id?: string
          package_name?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wheelchair_service?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_booking_reference: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_booking_by_reference: {
        Args: { booking_ref: string }
        Returns: {
          adults: number
          booking_reference: string
          booking_status: string
          children: number
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          departure_city: string
          departure_date: string
          extra_luggage: boolean
          id: string
          package_name: string
          package_price: number
          payment_method: string
          payment_status: string
          return_date: string
          room_type: string
          savings: number
          total_price: number
          wheelchair_service: boolean
        }[]
      }
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
