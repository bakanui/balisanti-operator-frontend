import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faSignOut } from '@fortawesome/free-solid-svg-icons'
import { useProSidebar } from "react-pro-sidebar";
import Popup from "reactjs-popup";
import { MenuIcon } from "@/assets/svg/MenuIcon";
import { Alert } from "./Alert";
import { useEffect, useState } from "react";
import { clearStorage, getStorageValue } from "../utils/localstoreage";
import { useRouter } from "next/navigation";
import { IAuth } from "../types/auth";

export const HeaderBar = () => {
  const { collapseSidebar } = useProSidebar();
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [user, setUser] = useState<IAuth | null>(null);
  const router = useRouter();

  useEffect(()=>{
      let user = getStorageValue('auth');
      if (user) {
          setUser(user);
      }
  },[]);

  const closeModal = () => {
      setmodalIsOpen(false);
  }
  
  const logout = () => {
      setmodalIsOpen(true);
  }

  const confirmLogout = () => {
    clearStorage('auth');
      router.replace('/login');
  }

return(
    <div className="w-full min-w-[300px] h-[64px] p-4 flex flex-row items-center justify-between absolute z-[1000] dark:bg-slate-800 bg-background">
        <div className="cursor-pointer" onClick={() => collapseSidebar()}>
            <MenuIcon />
        </div>
        <div className="flex flex-row items-center justify-center">
            <div className="mr-8">
                <FontAwesomeIcon className="text-primary cursor-pointer" icon={faBell}/>
            </div>
            <Popup trigger={
                <div className="flex flex-row cursor-pointer">
                    <div>
                        <div className="font-robotobold text-xs text-right">
                            {user?.user.name}
                        </div>
                        <div className="font-robotoregular text-[8pt] text-right">
                            {user?.user.nama_role}
                        </div>
                    </div>
                    <div className="h-[30px] w-[30px] bg-primary flex justify-center items-center rounded-full ml-4">
                        <FontAwesomeIcon className="text-[white] text-sm" icon={faUser}/>
                    </div>
                </div>
                } 
                position="bottom right">
                <div className="z-[99999]">
                    <ul className="py-2">
                        <li onClick={logout} className="cursor-pointer text-sm font-robotoregular p-2 cursor-pointer hover:bg-primary rounded-lg hover:text-white">
                            <FontAwesomeIcon className="mr-2" icon={faSignOut}/>
                            Logout
                        </li>
                    </ul>
                </div>
            </Popup>
        </div>
        <Alert
            title="Log Out"
            content="Apakah Anda yakin ingin Log Out?"
            confirmText="Ya"
            cancelText="Tidak"
            isOpen={modalIsOpen}
            closeAlert={closeModal}
            confirmAlert={confirmLogout}
        />
    </div>
    );
}