import React from 'react'
import OnBoardingPage from './_components/onboarding-form'
import { industries } from '@/data/industries'
import { getUserOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation'

const OnboardingPage = async() => {
    const {isOnboarded} = await getUserOnboardingStatus()
    if(isOnboarded){
        redirect('/dashboard')
    }
  return (
    <main>
        <OnBoardingPage industries= {industries}/>
    </main>
  )
}

export default OnboardingPage
