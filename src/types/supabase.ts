export type Database = {
  public: {
    Tables: {
      deportation_data: {
        Row: {
          id: number;
          date: string;
          arrests: number;
          detainers: number;
          image_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["deportation_data"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["deportation_data"]["Row"]
        >;
      };
    };
  };
};
