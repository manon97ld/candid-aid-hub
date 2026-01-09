import { useState, useCallback } from "react";
import { Upload, FileText, X, Check, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TunnelData } from "@/types/tunnel";
import { cn } from "@/lib/utils";

interface Step6DocumentsProps {
  data: TunnelData;
  onChange: (updates: Partial<TunnelData>) => void;
  errors: Record<string, string>;
}

type FileType = 'cv' | 'lettre' | 'diplomes' | 'certificats';

export function Step6Documents({ data, onChange, errors }: Step6DocumentsProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState<FileType | null>(null);

  const handleDrag = useCallback((e: React.DragEvent, type: FileType, isDragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(isDragging ? type : null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, type: FileType) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0], type);
    }
  }, []);

  const handleFileChange = async (file: File, type: FileType) => {
    const fieldMap: Record<FileType, keyof TunnelData> = {
      cv: 'cvFile',
      lettre: 'lettreMotivationFile',
      diplomes: 'diplomesFile',
      certificats: 'certificatsFile'
    };

    onChange({ [fieldMap[type]]: file });

    // Si c'est le CV, lancer l'analyse IA simulée
    if (type === 'cv') {
      setIsAnalyzing(true);
      
      // Simulation de l'analyse IA (à remplacer par un vrai appel API)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Résultats simulés
      const mockSkills = [
        "Communication", "Gestion de projet", "Excel", "Word", 
        "Service client", "Travail en équipe", "Anglais B2"
      ];
      const mockExperiences = [
        "3 ans d'expérience en service client",
        "Gestion d'équipe de 5 personnes",
        "Formation en gestion de projet"
      ];
      
      onChange({
        competencesExtraites: mockSkills,
        experiencesExtraites: mockExperiences,
        scoreCv: 72
      });
      
      setIsAnalyzing(false);
    }
  };

  const removeFile = (type: FileType) => {
    const fieldMap: Record<FileType, keyof TunnelData> = {
      cv: 'cvFile',
      lettre: 'lettreMotivationFile',
      diplomes: 'diplomesFile',
      certificats: 'certificatsFile'
    };
    onChange({ [fieldMap[type]]: null });
    
    if (type === 'cv') {
      onChange({
        competencesExtraites: [],
        experiencesExtraites: [],
        scoreCv: 0
      });
    }
  };

  const FileUploadZone = ({ 
    type, 
    label, 
    file, 
    required = false 
  }: { 
    type: FileType; 
    label: string; 
    file: File | null; 
    required?: boolean;
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {file ? (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">{file.name}</p>
              <p className="text-sm text-green-600">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFile(type)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "upload-zone relative",
            dragActive === type && "upload-zone-active"
          )}
          onDragEnter={(e) => handleDrag(e, type, true)}
          onDragLeave={(e) => handleDrag(e, type, false)}
          onDragOver={(e) => handleDrag(e, type, true)}
          onDrop={(e) => handleDrop(e, type)}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange(file, type);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">
              Glisse ton fichier ici ou clique pour parcourir
            </p>
            <p className="text-sm text-gray-400">
              PDF, DOC, DOCX (max 10MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-navy mb-3">
          📎 Tes documents
        </h1>
        <p className="text-gray-600">
          Télécharge ton CV et autres documents pour compléter ton profil
        </p>
      </div>

      <div className="space-y-8">
        {/* CV Upload avec analyse IA */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">
            1) Ton CV
          </h2>

          <FileUploadZone 
            type="cv" 
            label="Télécharge ton CV" 
            file={data.cvFile} 
            required 
          />

          {/* Analyse IA en cours */}
          {isAnalyzing && (
            <div className="mt-6 p-6 bg-navy/5 rounded-xl border border-navy/10">
              <div className="flex items-center gap-3 mb-4">
                <Loader2 className="w-5 h-5 text-gold animate-spin" />
                <span className="font-medium text-navy">Analyse de ton CV en cours...</span>
              </div>
              <Progress value={66} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">
                Notre IA analyse ton CV pour extraire tes compétences et expériences
              </p>
            </div>
          )}

          {/* Résultats de l'analyse */}
          {data.scoreCv > 0 && !isAnalyzing && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">CV analysé avec succès !</span>
                </div>
              </div>

              {/* Score CV */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-navy">Score de qualité du CV</span>
                  <span className="text-lg font-bold text-gold">{data.scoreCv}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      data.scoreCv >= 80 ? "bg-green-500" : 
                      data.scoreCv >= 60 ? "bg-gold" : "bg-orange-500"
                    )}
                    style={{ width: `${data.scoreCv}%` }}
                  />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-4 h-4",
                        star <= Math.round(data.scoreCv / 20)
                          ? "text-gold fill-gold"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Compétences extraites */}
              {data.competencesExtraites.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-navy mb-3">Compétences détectées :</p>
                  <div className="flex flex-wrap gap-2">
                    {data.competencesExtraites.map((skill, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="bg-gold/10 text-gold-dark"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Expériences extraites */}
              {data.experiencesExtraites.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-navy mb-3">Expériences clés :</p>
                  <ul className="space-y-2">
                    {data.experiencesExtraites.map((exp, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Autres documents */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">
            Documents supplémentaires (optionnel)
          </h2>

          <div className="space-y-6">
            <FileUploadZone 
              type="lettre" 
              label="2) Lettre de motivation (modèle)" 
              file={data.lettreMotivationFile} 
            />

            <FileUploadZone 
              type="diplomes" 
              label="3) Diplômes (CESS, haute école, université...)" 
              file={data.diplomesFile} 
            />

            <FileUploadZone 
              type="certificats" 
              label="4) Certificats de formation" 
              file={data.certificatsFile} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
