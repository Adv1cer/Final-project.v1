import { useSession } from 'next-auth/react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function Taskbar() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex justify-between">
            <div>
                <h3 className="text-3xl py-3 ml-10">
                    Welcome Back! {session?.user?.name || "Guest"}
                </h3>
            </div>
            <div className="justify-center content-center space-x-4 mr-10">
                <button className="px-3 py-2 bg-blue-800 text-white rounded-md"
                    onClick={() => router.push('/dashboard')} >
                    หนัาหลัก
                </button>
                <Button className="px-3 py-2 bg-blue-800 text-white rounded-md"
                    onClick={() => router.push('/medicine')} >
                    คลังยา
                </Button>
                <Button className="px-3 py-2 bg-blue-800 text-white rounded-md">
                    ประวัติ
                </Button>
            </div>
        </div>
    );



}
