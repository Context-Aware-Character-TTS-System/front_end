"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, X, AlertTriangle } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

export default function UploadPage() {
  const [title, setTitle] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type === "text/plain") {
      setUploadedFile(file)
      // 파일 이름에서 확장자를 제외하고 제목으로 설정
      setTitle(file.name.replace(/\.txt$/, ""))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
    },
    multiple: false,
  })

  const handleUpload = async () => {
    if (!uploadedFile || !title) {
      setError("파일과 제목을 모두 입력해주세요.")
      return
    }

    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    // SRS: file field should be `file` (not `textfile`)
    formData.append("file", uploadedFile)
    formData.append("title", title)
    
    try {
      await api("/novels", {
        method: "POST",
        body: formData,
      })
      alert("업로드가 완료되었습니다. 대시보드에서 처리 상태를 확인하세요.")
      router.push("/dashboard")
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setTitle("")
    setIsUploading(false)
    setError(null)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">소설 업로드</h1>
        <p className="text-gray-600">텍스트 파일을 업로드하여 오디오북으로 변환하세요</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>파일 업로드</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-md">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                {isDragActive ? "파일을 여기에 놓으세요" : "파일을 드래그하거나 클릭하여 업로드"}
              </p>
              <p className="text-sm text-gray-500">.txt 파일만 지원됩니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={removeFile} disabled={isUploading}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">소설 제목</Label>
                <Input 
                  id="title" 
                  placeholder="소설 제목을 입력하세요" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading} 
                />
              </div>

              <Button onClick={handleUpload} disabled={isUploading} className="w-full">
                {isUploading ? "업로드 중..." : "업로드 시작"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
