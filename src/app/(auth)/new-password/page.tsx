import NewPassword from '@/features/auth/component/NewPassword'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPassword />
    </Suspense>
  )
}

export default page