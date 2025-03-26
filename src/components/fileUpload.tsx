// components/FileUploader.tsx
'use client';
import { uploadFilesToS3 } from '@/lib/s3';
import { useDropzone } from 'react-dropzone';
import { FaRegFilePdf } from 'react-icons/fa';

export default function FileUploader() {
  const onDrop = async (acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    const file = acceptedFiles[0];
    if(file.size > 10*1024*1024) {
      alert('please upload a smaller file');
      return;
    }
    try{
      const data = await uploadFilesToS3(file);
      console.log('data',data);
    }catch(error) {
      console.log(error);
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
      {/* 返回的属性会通过 对象展开语法 {...getInputProps()} 传递给 <input />{' '}元素，从而让 <input /> 自动具有上传文件的功能。上传位置在onDrop中设置 */}
      {/* 根据isDragActive是否有文件拖拽到了区域，动态显示提示信息 */}
      {isDragActive ? (
        <div className="flex justify-center items-center gap-2 py-4">
          <FaRegFilePdf color="white" />
          <p className="text-slate-200">Release to upload files</p>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-2 py-4">
          <FaRegFilePdf color="white" />
          <p className="text-slate-200">
            Drag and drop the file here or click Upload
          </p>
        </div>
      )}
    </div>
  );
}
