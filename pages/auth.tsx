import Input from "@/components/Input";
import {useCallback, useState} from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [pwd, setPwd] = useState("");
  const [variant, setVariant] = useState("sign-in")
  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === "sign-in" ? "register" : "sign-in");
  }, []);

  const login = useCallback(async () => {

    try {
        await signIn("credentials", {
            email,
            pwd,
            callbackUrl: "/profiles",
        });
    } catch (err) {
        console.log(err);
    }
  }, [email, pwd])

  const register = useCallback(async () => {

    try {
        await axios.post("/api/register", {
            email,
            userName,
            pwd
        });
        login();
    } catch (err) {
        console.log(err);
    }
  }, [email, userName, pwd, login])



  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black h-full w-full bg-opacity-50">
          <nav className="px-0 py-5">
              <img src="/images/Logo.png" alt="logo" className="h-40"/>
          </nav>
          <div className="flex justify-center">
              <div className="bg-black bg-opacity-70 px-16 py-8 self-center mt-2 lg:w-2/5 max-w-md rounded-md w-full">
                <h2 className="text-white text-4xl mb-8 font-semibold">
                  {variant === "sign-in" ? "Sign In" : "Register"}
                </h2>
                <div className="flex flex-col gap-4">
                    {variant === "register" && (
                      <Input
                        label="Username"
                        onChange={(e: any) => setUserName(e.target.value)}
                        id="userName"
                        type="userName"
                        value={userName}
                      />)
                    }
                  <Input
                    label="Email"
                    onChange={(e: any) => setEmail(e.target.value)}
                    id="email"
                    type="email"
                    value={email}
                  />
                  <Input
                    label="Password"
                    onChange={(e: any) => setPwd(e.target.value)}
                    id="pwd"
                    type="pwd"
                    value={pwd}
                  />
                </div>
                <button onClick={variant === 'sign-in' ? login : register} className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
                    {variant === "sign-in" ? "Sign In" : "Register"}
                </button>
                <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                    <div
                      onClick={() => signIn('google', { callbackUrl: '/profiles' })}
                      className="
                      w-10
                      h-10
                      bg-white
                      rounded-full
                      flex
                      items-center
                      justify-center
                      cursor-pointer
                      hover:opacity-80
                      transition
                      ">
                        <FcGoogle size={30}/>
                    </div>
                    <div
                      onClick={() => signIn('github', { callbackUrl: '/profiles' })}
                      className="
                      w-10
                      h-10
                      bg-white
                      rounded-full
                      flex
                      items-center
                      justify-center
                      cursor-pointer
                      hover:opacity-80
                      transition
                      ">
                        <FaGithub size={30}/>
                    </div>
                    <div
                      className="
                      w-10
                      h-10
                      bg-white
                      rounded-full
                      flex
                      items-center
                      justify-center
                      cursor-pointer
                      hover:opacity-80
                      transition
                      ">
                        <FaXTwitter size={30}/>
                    </div>
                </div>
                <p className="text-neutral-500 mt-12">
                    {variant === "sign-in" ? "New to Kosmicflix?" : "Already have an account?"}
                    <span onClick={toggleVariant} className=" text-white ml-1 hover:underline cursor-pointer">
                        {variant === "sign-in" ? "Create an account" : "Sign In Here"}
                    </span>
                </p>
              </div>
          </div>
      </div>
    </div>
  );
}
export default Auth;