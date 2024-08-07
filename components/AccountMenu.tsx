import { signOut } from 'next-auth/react';
import React from 'react';
import useCurrentUser from "@/hooks/useCurrentUser";

interface AccountMenuProps {
    visible?: boolean;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ visible = false }) => {
    const { data: user} = useCurrentUser();
    if (!visible) {return null;}

    return (
        <div className="bg-black w-56 absolute top-14 right-0 py-5 flex-col border-2 border-gray-800 flex">
            <div className="flex flex-col gap-3">
                <div className="px-3 group/item flex flex-row gap-3 items-center w-full">
                    <img src={'/images/avatar_jpg.jpeg'} className="w-8 rounded-md" alt="avatar"/>
                    <p className="text-white text-sm group-hover/item:underline">
                        {user.name}
                    </p>
                </div>
                <hr className="bg-gray-600 border-0 h-px my-4" />
                <div onClick={() => signOut()} className="px-3 text-center text-white text-sm hover:underline">
                    Sign out of KosmicFlix
                </div>
            </div>
        </div>
    )
}
export default AccountMenu;