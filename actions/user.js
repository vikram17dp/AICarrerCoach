"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export async function updateUser (data){
    const {userId} = await auth();
    if(!userId) throw new Error("Unauthorized")
    const user = await db.user.findUnique({
        where:{
            clerkUserId:userId
        }
    })
    if (!user) throw new Error("User not found");
    try {
         // Start a transaction to handle both operations this from prisma feature
         const result = await db.$transaction(
            async (tx)=>{
                let industryInsight = await tx.industryInsight.findUnique({
                    where: {
                      industry: data.industry,
                    },
                  });

                   // If industry doesn't exist, create it with default values
                   if (!industryInsight) {
                    
          
                    industryInsight = await tx.industryInsight.create({
                      data: {
                        industry: data.industry,
                        salaryRanges:[],
                        growthRate:0,
                        demandLevel:"MEDIUM",
                        topSkills:[],
                        marketOutlook:"NETURAL",
                        keyTrends:[],
                        recommendedSkills:[],
                        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                      },
                    });
                  }
                   // Now update the user
        const updatedUser = await tx.user.update({
            where: {
              id: user.id,
            },
            data: {
              industry: data.industry,
              experience: data.experience,
              bio: data.bio,
              skills: data.skills,
            },
          });
  
          return { updatedUser, industryInsight };
        },
        {
          timeout: 10000, // default: 5000
        });
        revalidatePath("/");
        return {success:true,...result}
    } catch (error) {
        console.error("Error updating user and industry:", error.message);
        throw new Error("Failed to update profile");
    }
}

export async function getUserOnboardingStatus() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) throw new Error("User not found");
    try {
        const user = await db.user.findUnique({
            where:{
                clerkUserId:userId
            },select:{
                industry:true
            }
        })
        return {
            isOnboarded: !!user?.industry
        }
    } catch (error) {
        console.error("Error checking onboarding status:", error.message);
        throw new Error("Failed to check onboarding status");
    }
}