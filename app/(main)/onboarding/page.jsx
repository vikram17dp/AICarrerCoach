import React from 'react'
import { industries } from '@/data/industries'
import { getUserOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation'
import OnBoardingForm from './_components/onboarding-form'

const OnboardingPage = async() => {
    const {isOnboarded} = await getUserOnboardingStatus()
    if(isOnboarded){
        redirect('/dashboard')
    }
  return (
    <main>
        <OnBoardingForm industries= {industries}/>
    </main>
  )
}

export default OnboardingPage
