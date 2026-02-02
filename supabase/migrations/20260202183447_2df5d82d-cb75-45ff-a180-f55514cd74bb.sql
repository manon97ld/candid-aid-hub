-- Créer le bucket pour les documents des candidats
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Les utilisateurs peuvent uploader leurs propres documents
CREATE POLICY "Users can upload own documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Les utilisateurs peuvent voir leurs propres documents
CREATE POLICY "Users can view own documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Les utilisateurs peuvent supprimer leurs propres documents
CREATE POLICY "Users can delete own documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Les assistants peuvent voir les documents de leurs candidats assignés
CREATE POLICY "Assistants can view assigned candidat documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'documents'
  AND EXISTS (
    SELECT 1 FROM candidats
    WHERE candidats.assistant_id = auth.uid()
    AND candidats.user_id::text = (storage.foldername(name))[1]
  )
);