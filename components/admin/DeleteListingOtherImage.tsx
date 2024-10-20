import React from 'react'

type Props = {
    id: string
    img: string
}


const DeleteListingOtherImage = ({id, img}: Props) => {
  return (
      <div>DeleteListingOtherImage { id} {img}</div>
  )
}

export default DeleteListingOtherImage