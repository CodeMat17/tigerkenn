import React from 'react'

type Props = {
    id: string;
    img: string;
}


const DeleteListingMainImage = ({id, img}: Props) => {
  return (
      <div>DeleteListingMainImage {id} { img}</div>
  )
}

export default DeleteListingMainImage