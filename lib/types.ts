export interface Template {
  id: string;
  owner_email: string;
  template_type: string;
  template_code: string;
  slug: string;
  is_published: boolean;
  data: {
    question: string;
  };
  created_at: string;
  updated_at: string;
}
