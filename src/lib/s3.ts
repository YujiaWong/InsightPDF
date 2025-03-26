import AWS from 'aws-sdk';

export async function uploadFilesToS3(file: File) {
  try {
    // 设置 AWS 配置
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    });

    // 创建一个 S3 服务的实例，使得你能够通过它进行文件上传、下载等操作
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME, // 指定要操作的 bucket 名称
      },
      region: 'us-west-1', // 区域代码
    });

    // 文件的 Key 名称, params 变量定义了上传到 S3 时所需的所有信息，可以看作是为上传文件做准备。
    const file_key =
      'uploads/' + Date.now().toString() + file.name.replace(' ', '-');

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    // 上传文件到 S3
    const upload = s3
      .putObject(params)
      .on('httpUploadProgress', (evt) => {
        console.log(
          'Uploading to S3...',
          parseInt(((evt.loaded * 100) / evt.total).toString()) + '%'
        );
      })
      .promise();

    // 等待上传完成
    await upload;
    console.log('Successfully uploaded to S3!', file_key);


    return Promise.resolve({
      file_key,
      file_name: file.name,
    });
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error; // 可以抛出错误，方便调用者处理
  }
}

// 获取 S3 文件的 URL
export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${file_key}`;
  return url;
}
