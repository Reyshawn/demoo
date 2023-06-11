import React from 'react'

export const DSwitchPage = React.lazy(() => import('./DSwitchPage/index'))
export const DScrollpickerPage = React.lazy(() => import('./DScrollPickerPage/index'))
export const DDatePickerPage = React.lazy(() => import('./DDatePickerPage/index'))


export default function ComponentsPage(props: any) {
  return (
    <>
      this is components page
    </>
  )
}
