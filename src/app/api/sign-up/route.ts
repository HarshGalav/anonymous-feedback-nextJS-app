import dbConnect from "@/lib/dbConnect";
import UserModel from "../../model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request,res:Response){
    await dbConnect();
    try{
        const {username,email,password} = await request.json();
        const existingUserVerifiedByUserName=await UserModel.findOne({
            username,
            isVerified:true
        });
        const existingUserVerifiedByEmail=await UserModel.findOne({
            email,
            isVerified:true
        });
        const verifyCode=Math.floor(100000+Math.random()*900000).toString();
        if(existingUserVerifiedByUserName ){
            return Response.json(
                {
                    success:false,
                    message:"User already exists"
                },
                {status:400}
            )
        
        }
        if(existingUserVerifiedByEmail){
            if(existingUserVerifiedByEmail.isVerified){
                return Response.json(
                    {
                        success:false,
                        message:"User already exist with this email"
                    },
                    {status:400}
                )
            }
            else{
                const hashedPassword=await bcrypt.hash(password,10);

                existingUserVerifiedByEmail.password=hashedPassword;
                existingUserVerifiedByEmail.verifyCode=verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry=new Date(Date.now()+1000*60*60);
                await existingUserVerifiedByEmail.save();
            }
        }
        else{
            const hashedPassword=await bcrypt.hash(password,10);

            const expiryDate=new Date();
            expiryDate.setHours(expiryDate.getHours()+1);
            const newUser=new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessages:true,
                messages:[],
            })
            await newUser.save();
        }
        const emailResponse =await sendVerificationEmail(
            email,username,
            verifyCode
        )
        if(!emailResponse.success){
            return Response.json(
                {
                    success:false,
                    message:"Failed to send verification email"
                },
                {status:500}
            )
        }
        return Response.json(
            {
                success:true,
                message:"User registered successfully, Please verify your email"
            },
            {status:201}
        )


}
    catch(error){
        console.error("Error signing up user",error);
        return Response.json(
            {
                success:false,
                message:"Failed to sign up user"
            },
            {status:500}
        )
    }
}


