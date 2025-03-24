import FileUploader from '@/components/fileUpload';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { BsBoxArrowInRight } from 'react-icons/bs';

export default async function Home() { //next.js13新增，async说明服务器渲染，渲染好一整个页面给用户
  const {userId} = await auth();
  const isAuth = !!userId;
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-indigo-200 to-slate-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="flex justify-center items-center gap-2">
            <h1 className="text-black text-[48px] font-bold">
              Chat with any PDF
            </h1>
            <UserButton
              appearance={{
                elements: {
                  rootBox: 'w-full h-full', // 允许撑满父容器
                  avatarBox: 'w-full h-full rounded-full',
                },
              }}
            />
          </div>
          <div className="flex">{isAuth && <Button>Go to chats</Button>}</div>
          <p className="text-center max-w-[500px] text-slate-600">
            Join millions of students, research and professionals to instantly
            answer questions and understand research with AI
          </p>
          <div className="w-full mt-4">
            {isAuth ? (
              <FileUploader/>
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get Started!
                  <BsBoxArrowInRight />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
