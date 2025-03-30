// components/FileUploader.tsx
'use client';
import { uploadFilesToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { FaRegFilePdf } from 'react-icons/fa';
import axios from 'axios';
import toast from "react-hot-toast";
import { useState } from 'react';
import { VscLoading } from 'react-icons/vsc';

export default function FileUploader() {
  const [uploading , setUploading] = useState(false);
  const {mutate,isPending} = useMutation({
    mutationFn:async({file_key, file_name}:{file_key:string, file_name:string}) =>{
      const response = await axios.post('/api/create-chat',{
        file_key,file_name
      });
      return response.data
    }
  })

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if(file.size > 10*1024*1024) {
      toast.error('File to large');
      return;
    }
    try{
      setUploading(true);
      const data = await uploadFilesToS3(file);
      if(!data.file_key || !data.file_name){
        toast.error("Something went wrong")
        return;
      }
      mutate(data,{
        onSuccess:(data) =>{
          toast.success(data.message);
          console.log(data);
        },
        onError:(error)=>{
          toast.error("Error creating chat");
          console.log(error);
        }
      })
      console.log('data',data);
    }catch(error) {
      console.log(error);
    }finally{
      setUploading(false);
    }
  };
  //onDrop 被封装在 useCallback 中，且依赖数组为空,确保在组件生命周期中只会创建一次函数，避免重新渲染时重新创建函数。
  //onDrop 接受 acceptedFiles 作为参数，这样每次文件被拖拽或选择时，acceptedFiles 都是最新的，可以用来进行后续操作（比如上传或处理文件）。

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept:{"application/pdf":[".pdf"]}, maxFiles:1 });

  return (
    <div
      {...getRootProps()} //getRootProps是useDropzone解构出来的一个方法，这个方法在这里把返回的对象接着解构
      //通过 {...getRootProps()}，你将拖拽区域的相关属性添加到该元素上，让它能够处理拖拽操作,此区域变成拖拽区域。
      className="border-2 border-dashed p-4 rounded-lg cursor-pointer text-center"
    >
      <input {...getInputProps()} />
      {uploading || isPending ? (
        <div className='flex justify-center items-center gap-2 py-6'>
          <VscLoading className="h-5 w-5 text-slate-500 animate-spin" />
          <p className="text-slate-200">Spilling Tea to GPT...</p>
        </div>
      ) : (
        <>
          {/* 返回的属性会通过 对象展开语法 {...getInputProps()} 传递给 <input />{' '}元素，从而让 <input /> 自动具有上传文件的功能。上传位置在onDrop中设置 */}
          {/* 根据isDragActive是否有文件拖拽到了区域，动态显示提示信息 */}
          {isDragActive ? (
            <div className="flex justify-center items-center gap-2 py-6">
              <FaRegFilePdf color="white" />
              <p className="text-slate-200">Release to upload files</p>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-2 py-6">
              <FaRegFilePdf color="white" />
              <p className="text-slate-200">
                Drag and drop the file here or click Upload
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
