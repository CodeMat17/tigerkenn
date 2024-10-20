"use client";

import { CloudUploadIcon, MinusIcon } from "lucide-react";
import dynamic from "next/dynamic";
// import Image from "next/image";
import {  useState } from "react";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { Button } from "../ui/button";
import ListingOtherImages from "../ListingOtherImages";
import ListingMainImage from "../ListingMainImage";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type DataProps = {
  id: string;
  listTitle: string;
  listLocation: string;
  listDesc: string;
  listPrice: number;
  listBeds: string;
  listBaths: string;
  listSqm: number;
  listStatus: string;
  listImg: string;
  listOtherImgs: string[];
};



const UpdateListingPage = ({
  id,
  listTitle,
  listLocation,
  listDesc,
  listPrice,
  listBeds,
  listBaths,
  listSqm,
  listStatus,
  listImg,
  listOtherImgs,
}: DataProps) => {
  // const mainInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(listTitle || "");
  const [location, setLocation] = useState(listLocation || "");
  const [desc, setDesc] = useState(listDesc || "");
  const [price, setPrice] = useState<number>(listPrice || 0);
  const [beds, setBeds] = useState(listBeds || "");
  const [baths, setBaths] = useState(listBaths || "");
  const [sqm, setSqm] = useState<number>(listSqm || 0);
  const [status, setStatus] = useState(listStatus || ""); 

  const [updatingTitle, setUpdatingTitle] = useState(false);
  const [updatingLocation, setUpdatingLocation] = useState(false);
  const [updatingPrice, setUpdatingPrice] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingBeds, setUpdatingBeds] = useState(false);
  const [updatingBaths, setUpdatingBaths] = useState(false);
  const [updatingSqm, setUpdatingSqm] = useState(false);
  const [updatingDesc, setUpdatingDesc] = useState(false);


  // const handleMainButtonClick = () => {
  //   if (mainInputRef.current) {
  //     mainInputRef.current.click();
  //   }
  // };






  const updateListingTitle = async () => {
    setUpdatingTitle(true);

    //Basic validation
    if (!title) {
      toast.error("Title cannot be blank");
      return;
    }

    try {
      const res = await fetch("/api/update-listing-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title }),
      });

      const result = await res.json();

      if (res.ok) {
        toast("DONE!", {
          description: "Title updated successfully",
        });
      } else {
        toast.error("ERROR!", {
          description: `${result.error} || Something went wrong`,
        });
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
    } finally {
      setUpdatingTitle(false);
    }
  };

  const updateListingLocation = async () => {
    setUpdatingLocation(true);

    //Basic validation
    if (!location) {
      toast.error("Location cannot be blank");
      return;
    }

    try {
      const res = await fetch("/api/update-listing-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, location }),
      });

      const result = await res.json();

      if (res.ok) {
        toast("DONE!", {
          description: "Location updated successfully",
        });
      } else {
        toast.error("ERROR!", {
          description: `${result.error} || Something went wrong`,
        });
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
    } finally {
      setUpdatingLocation(false);
    }
  };

  const updateListingPrice = async () => {
    setUpdatingPrice(true);

    //Basic validation
    if (!price) {
      toast.error("Price cannot be blank");
      return;
    }

    try {
      const res = await fetch("/api/update-listing-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price }),
      });

      const result = await res.json();

      if (res.ok) {
        toast("DONE!", {
          description: "Price updated successfully",
        });
      } else {
        toast.error("ERROR!", {
          description: `${result.error} || Something went wrong`,
        });
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
    } finally {
      setUpdatingPrice(false);
    }
  };

  const updateListingStatus = async () => {
    setUpdatingStatus(true);

    //Basic validation
    if (!status) {
      toast.error("Status cannot be blank");
      return;
    }

    try {
      const res = await fetch("/api/update-listing-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const result = await res.json();

      if (res.ok) {
        toast("DONE!", {
          description: "Status updated successfully",
        });
      } else {
        toast.error("ERROR!", {
          description: `${result.error} || Something went wrong`,
        });
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const updateListingBeds = async () => {
    setUpdatingBeds(true);

    //Basic validation
    if (!beds) {
      toast.error("Beds cannot be blank");
      return;
    }

    try {
      const res = await fetch("/api/update-listing-beds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, beds }),
      });

      const result = await res.json();

      if (res.ok) {
        toast("DONE!", {
          description: "Beds updated successfully",
        });
      } else {
        toast.error("ERROR!", {
          description: `${result.error} || Something went wrong`,
        });
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
    } finally {
      setUpdatingBeds(false);
    }
  };

  const updateListingBaths = async () => {
    setUpdatingBaths(true);

    //Basic validation
    if (!baths) {
      toast.error("Baths cannot be blank");
      return;
    }

    try {
      const res = await fetch("/api/update-listing-baths", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, baths }),
      });

      const result = await res.json();

      if (res.ok) {
        toast("DONE!", {
          description: "Baths updated successfully",
        });
      } else {
        toast.error("ERROR!", {
          description: `${result.error} || Something went wrong`,
        });
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
    } finally {
      setUpdatingBaths(false);
    }
  };

  const updateListingSqm = async () => {
    setUpdatingSqm(true);

    //Basic validation
    if (!sqm) {
      toast.error("Sqm cannot be blank");
      return;
    }

    try {
      const res = await fetch("/api/update-listing-sqm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, sqm }),
      });

      const result = await res.json();

      if (res.ok) {
        toast("DONE!", {
          description: "Sqm updated successfully",
        });
      } else {
        toast.error("ERROR!", {
          description: `${result.error} || Something went wrong`,
        });
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
    } finally {
      setUpdatingSqm(false);
    }
  };

  const updateListingDesc = async () => {
    setUpdatingDesc(true);

    //Basic validation
    if (!desc) {
      toast.error("Description cannot be blank");
      return;
    }

    try {
      const res = await fetch("/api/update-listing-desc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, desc }),
      });

      const result = await res.json();

      if (res.ok) {
        toast("DONE!", {
          description: "Description updated successfully",
        });
      } else {
        toast.error("ERROR!", {
          description: `${result.error} || Something went wrong`,
        });
      }
    } catch (error) {
      console.log("ErrorMsg: ", error);
    } finally {
      setUpdatingDesc(false);
    }
  };

  return (
    <div className='w-full max-w-4xl mx-auto'>
      <div className='py-8 flex flex-col gap-3'>
        <div>
          <label>Title</label>
          <div className='flex items-center border border-gray-400 rounded-xl overflow-hidden mt-1'>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Title'
              required
              className='outline-none border-none w-full bg-inherit px-3'
            />
            <Button
              onClick={updateListingTitle}
              size='icon'
              className='py-5 w-20 rounded-none'>
              {updatingTitle ? (
                <MinusIcon className='animate-spin' />
              ) : (
                <CloudUploadIcon />
              )}
            </Button>
          </div>
        </div>

        <div className='flex gap-3'>
          <div>
            <label>Price (₦)</label>
            <div className='flex items-center border border-gray-400 rounded-xl overflow-hidden mt-1'>
              <input
                type='number'
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                placeholder='Price'
                className='outline-none border-none w-full bg-inherit px-3'
                required
              />
              <Button
                onClick={updateListingPrice}
                size='icon'
                className='py-5 w-20 rounded-none'>
                {updatingPrice ? (
                  <MinusIcon className='animate-spin' />
                ) : (
                  <CloudUploadIcon />
                )}
              </Button>
            </div>
          </div>
          <div>
            <label>Sqm</label>
            <div className='flex items-center border border-gray-400 rounded-xl overflow-hidden mt-1'>
              <input
                type='number'
                value={sqm}
                onChange={(e) => setSqm(parseFloat(e.target.value) || 0)}
                placeholder='Sqm'
                className='outline-none border-none w-full bg-inherit px-3'
                required
              />
              <Button
                onClick={updateListingSqm}
                size='icon'
                className='py-5 w-20 rounded-none'>
                {updatingSqm ? (
                  <MinusIcon className='animate-spin' />
                ) : (
                  <CloudUploadIcon />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className='flex gap-3'>
          <div>
            <label>Beds</label>
            <div className='flex items-center border border-gray-400 rounded-xl overflow-hidden mt-1'>
              <input
                type='text'
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                placeholder='Beds'
                className='outline-none border-none w-full bg-inherit px-3'
                required
              />
              <Button
                onClick={updateListingBeds}
                size='icon'
                className='py-5 w-20 rounded-none'>
                {updatingBeds ? (
                  <MinusIcon className='animate-spin' />
                ) : (
                  <CloudUploadIcon />
                )}
              </Button>
            </div>
          </div>
          <div>
            <label>Baths</label>
            <div className='flex items-center border border-gray-400 rounded-xl overflow-hidden mt-1'>
              <input
                type='text'
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
                placeholder='Baths'
                className='outline-none border-none w-full bg-inherit px-3'
                required
              />
              <Button
                onClick={updateListingBaths}
                size='icon'
                className='py-5 w-20 rounded-none'>
                {updatingBaths ? (
                  <MinusIcon className='animate-spin' />
                ) : (
                  <CloudUploadIcon />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className='flex gap-3'>
          <div>
            <label>Location</label>
            <div className='flex items-center border border-gray-400 rounded-xl overflow-hidden mt-1'>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder='Location'
                className='outline-none border-none w-full bg-inherit px-3'
                required
              />
              <Button
                onClick={updateListingLocation}
                size='icon'
                className='py-5 w-20 rounded-none'>
                {updatingLocation ? (
                  <MinusIcon className='animate-spin' />
                ) : (
                  <CloudUploadIcon />
                )}
              </Button>
            </div>
          </div>
          <div>
            <label>Status</label>
            <div className='flex items-center border border-gray-400 rounded-xl overflow-hidden mt-1'>
              <input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder='Eg. For Sale or For Rent'
                className='outline-none border-none w-full bg-inherit px-3'
                required
              />
              <Button
                onClick={updateListingStatus}
                size='icon'
                className='py-5 w-20 rounded-none'>
                {updatingStatus ? (
                  <MinusIcon className='animate-spin' />
                ) : (
                  <CloudUploadIcon />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <label>Description</label>
          <ReactQuill
            value={desc}
            onChange={setDesc}
            theme='snow'
            style={{
              border: "1px solid #ccc", // Custom border
              borderRadius: "12px", // Add some border radius
              overflowY: "hidden", // No scroll as height adjusts dynamically
            }}
            className='rounded-xl overflow-hidden mt-1 mb-2 border'
          />
          <Button onClick={updateListingDesc} className='w-full'>
            {updatingDesc ? <MinusIcon className='animate-spin' /> : "Update"}
          </Button>
        </div>

        <div>
          <label>Main Image</label>
          <ListingMainImage id={id} image={listImg} />
        </div>

        <div>
          <label>Other Images</label>

          <ListingOtherImages id={id} images={listOtherImgs} />
        </div>
      </div>
    </div>
  );
};

export default UpdateListingPage;
