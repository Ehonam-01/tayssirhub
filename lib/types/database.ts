// Types manuels reflétant supabase/migrations/0001_init_schema.sql, 0002_payments.sql,
// 0004_documents.sql, 0005_rooms.sql, 0006_flights.sql, 0007_guides.sql, 0008_crm.sql,
// 0009_accounting.sql, 0010_pilgrim_portal.sql et 0011_super_admin_pricing.sql.
// Pas de CLI Supabase disponible dans cet environnement pour `supabase gen types` :
// à resynchroniser à la main si le schéma évolue (ou régénérer via la CLI plus tard).

export type AgencyPlan = "starter" | "pro" | "business" | "enterprise";
export type UserRole = "owner" | "admin" | "agent";
export type CampaignType = "hajj" | "omra" | "ramadan" | "autre";
export type CampaignStatus = "draft" | "open" | "full" | "closed" | "completed";
export type PilgrimStatus =
  | "prospect"
  | "inscrit"
  | "dossier_incomplet"
  | "dossier_complet"
  | "confirme"
  | "parti"
  | "revenu"
  | "annule";
export type PilgrimGender = "homme" | "femme";
export type PaymentMethod = "especes" | "mobile_money" | "virement" | "stripe" | "cheque";
export type PaymentStatus = "scheduled" | "paid" | "cancelled";
export type DocumentType = "passeport" | "visa" | "photo" | "vaccins" | "billet" | "contrat" | "autre";
export type DocumentStatus = "en_attente" | "valide" | "expire" | "rejete";
export type RoomType = "individuelle" | "double" | "triple" | "quadruple" | "quintuple" | "autre";
export type FlightDirection = "aller" | "retour" | "interne";
export type CrmStage =
  | "prospect"
  | "contacte"
  | "relance"
  | "inscrit"
  | "paiement_recu"
  | "voyage_termine";
export type ExpenseCategory =
  | "hebergement"
  | "transport"
  | "vols"
  | "visas"
  | "guides"
  | "restauration"
  | "marketing"
  | "salaires"
  | "autre";

export interface Database {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          plan: AgencyPlan;
          logo_url: string | null;
          phone: string | null;
          address: string | null;
          country: string | null;
          receipt_sequence: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["agencies"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["agencies"]["Row"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          agency_id: string | null;
          role: UserRole;
          full_name: string | null;
          avatar_url: string | null;
          is_super_admin: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "profiles_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
        ];
      };
      campaigns: {
        Row: {
          id: string;
          agency_id: string;
          name: string;
          type: CampaignType;
          status: CampaignStatus;
          start_date: string | null;
          end_date: string | null;
          price: number | null;
          currency: string;
          quota: number | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["campaigns"]["Row"]> & {
          agency_id: string;
          name: string;
          type: CampaignType;
        };
        Update: Partial<Database["public"]["Tables"]["campaigns"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "campaigns_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
        ];
      };
      pilgrims: {
        Row: {
          id: string;
          agency_id: string;
          campaign_id: string | null;
          guide_id: string | null;
          first_name: string;
          last_name: string;
          gender: PilgrimGender | null;
          birth_date: string | null;
          nationality: string | null;
          profession: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          photo_url: string | null;
          status: PilgrimStatus;
          crm_stage: CrmStage;
          package_price: number | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["pilgrims"]["Row"]> & {
          agency_id: string;
          first_name: string;
          last_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["pilgrims"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "pilgrims_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pilgrims_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pilgrims_guide_id_fkey";
            columns: ["guide_id"];
            isOneToOne: false;
            referencedRelation: "guides";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          id: string;
          agency_id: string;
          pilgrim_id: string;
          amount: number;
          currency: string;
          method: PaymentMethod | null;
          status: PaymentStatus;
          due_date: string | null;
          paid_at: string | null;
          reference: string | null;
          receipt_number: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payments"]["Row"]> & {
          agency_id: string;
          pilgrim_id: string;
          amount: number;
          currency: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "payments_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_pilgrim_id_fkey";
            columns: ["pilgrim_id"];
            isOneToOne: false;
            referencedRelation: "pilgrims";
            referencedColumns: ["id"];
          },
        ];
      };
      documents: {
        Row: {
          id: string;
          agency_id: string;
          pilgrim_id: string;
          type: DocumentType;
          status: DocumentStatus;
          file_path: string;
          file_name: string;
          file_size: number | null;
          mime_type: string | null;
          expiry_date: string | null;
          rejection_reason: string | null;
          uploaded_by: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["documents"]["Row"]> & {
          agency_id: string;
          pilgrim_id: string;
          type: DocumentType;
          file_path: string;
          file_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["documents"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "documents_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_pilgrim_id_fkey";
            columns: ["pilgrim_id"];
            isOneToOne: false;
            referencedRelation: "pilgrims";
            referencedColumns: ["id"];
          },
        ];
      };
      hotels: {
        Row: {
          id: string;
          agency_id: string;
          campaign_id: string;
          name: string;
          city: string | null;
          address: string | null;
          stars: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["hotels"]["Row"]> & {
          agency_id: string;
          campaign_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["hotels"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "hotels_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "hotels_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
        ];
      };
      rooms: {
        Row: {
          id: string;
          agency_id: string;
          hotel_id: string;
          number: string;
          floor: string | null;
          type: RoomType;
          capacity: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["rooms"]["Row"]> & {
          agency_id: string;
          hotel_id: string;
          number: string;
          capacity: number;
        };
        Update: Partial<Database["public"]["Tables"]["rooms"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "rooms_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rooms_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          },
        ];
      };
      room_assignments: {
        Row: {
          id: string;
          agency_id: string;
          room_id: string;
          hotel_id: string;
          pilgrim_id: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["room_assignments"]["Row"]> & {
          agency_id: string;
          room_id: string;
          hotel_id: string;
          pilgrim_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["room_assignments"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "room_assignments_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "room_assignments_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "room_assignments_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "room_assignments_pilgrim_id_fkey";
            columns: ["pilgrim_id"];
            isOneToOne: false;
            referencedRelation: "pilgrims";
            referencedColumns: ["id"];
          },
        ];
      };
      flights: {
        Row: {
          id: string;
          agency_id: string;
          campaign_id: string;
          direction: FlightDirection;
          airline: string | null;
          flight_number: string | null;
          departure_airport: string | null;
          arrival_airport: string | null;
          departure_at: string | null;
          arrival_at: string | null;
          layovers: string | null;
          baggage_allowance: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["flights"]["Row"]> & {
          agency_id: string;
          campaign_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["flights"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "flights_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "flights_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
        ];
      };
      guides: {
        Row: {
          id: string;
          agency_id: string;
          full_name: string;
          phone: string | null;
          email: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["guides"]["Row"]> & {
          agency_id: string;
          full_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["guides"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "guides_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
        ];
      };
      expenses: {
        Row: {
          id: string;
          agency_id: string;
          campaign_id: string | null;
          category: ExpenseCategory;
          label: string;
          amount: number;
          currency: string;
          expense_date: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["expenses"]["Row"]> & {
          agency_id: string;
          label: string;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["expenses"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "expenses_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expenses_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
        ];
      };
      pilgrim_portal_access: {
        Row: {
          pilgrim_id: string;
          auth_user_id: string | null;
          invite_token: string;
          invited_at: string;
          invited_by: string | null;
          claimed_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["pilgrim_portal_access"]["Row"]> & {
          pilgrim_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["pilgrim_portal_access"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "pilgrim_portal_access_pilgrim_id_fkey";
            columns: ["pilgrim_id"];
            isOneToOne: true;
            referencedRelation: "pilgrims";
            referencedColumns: ["id"];
          },
        ];
      };
      pricing_plans: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          price_monthly: number | null;
          price_yearly: number | null;
          currency: string;
          is_custom_pricing: boolean;
          features: string[];
          cta_label: string;
          is_popular: boolean;
          has_free_trial: boolean;
          trial_days: number | null;
          color: string | null;
          display_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["pricing_plans"]["Row"]> & {
          slug: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["pricing_plans"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_agency_with_owner: {
        Args: { agency_name: string; agency_slug: string };
        Returns: string;
      };
      current_pilgrim_id: {
        Args: Record<string, never>;
        Returns: string | null;
      };
      claim_pilgrim_portal_access: {
        Args: { p_token: string };
        Returns: string;
      };
      get_portal_invite_pilgrim_name: {
        Args: { p_token: string };
        Returns: { first_name: string; email: string | null }[];
      };
      is_super_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      agency_plan: AgencyPlan;
      user_role: UserRole;
      campaign_type: CampaignType;
      campaign_status: CampaignStatus;
      pilgrim_status: PilgrimStatus;
      pilgrim_gender: PilgrimGender;
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
      document_type: DocumentType;
      document_status: DocumentStatus;
      room_type: RoomType;
      flight_direction: FlightDirection;
      crm_stage: CrmStage;
      expense_category: ExpenseCategory;
    };
  };
}
