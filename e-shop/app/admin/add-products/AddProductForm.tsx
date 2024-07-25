'use client';
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import TextArea from "@/app/components/inputs/TextArea";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import SelectColor from "@/app/components/inputs/SelectColor";
import Button from "@/app/components/Button";
import toast from "react-hot-toast";
import firebaseApp from "@/libs/firebase";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, useForm} from "react-hook-form";
import { categories } from "@/app/utils/categories";
import { colors } from "@/app/utils/colors";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export type ImageType = {
    color: string;
    colorCode: string;
    image: File | null;
}

export type UploadedImageType = {
    color: string;
    colorCode: string;
    image: string;
}

const AddProductForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<ImageType[] | null>();
    const [isProductCreated, setIsProductCreated]  = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState:{errors}
        } = useForm<FieldValues>({
        defaultValues:{
            name : "",
            description: "",
            brand: "",
            category: "",
            inStock: false,
            images:[],
            price: "",
        }
    })

    useEffect(() => {
        setCustomValue("images", images);
    }, [images]);

    useEffect(() => {
        if(isProductCreated){
            reset();
            setImages(null);
            setIsProductCreated(false);
        }
    }, [isProductCreated]);

    const onSubmit: SubmitHandler<FieldValues> = async (data) =>{
        //console.log("Product data", data);
        // Upload imgaes to firebase
        setIsLoading(true);
        let uploadedImages: UploadedImageType[] =[];
        if (!data.category) {
            setIsLoading(false);
            return toast.error("Category is not selected");
        }

        if (!data.images || data.length ===0) {
            return toast.error("NO selected images");
        }

        const handleImageUploads = async () =>{
            toast("Creating product, please wait...")
            try {
                for (const item of data.images) {
                    if (item.image) {
                        const fileName = new Date().getTime() + "-" + item.image.name;
                        const storage = getStorage(firebaseApp);
                        const storageRef = ref(storage,`products/${fileName}`);

                        // Upload the file and metadata
                        const uploadTask = uploadBytesResumable(storageRef, item.image);
                        
                        await new Promise<void> ((resolve, reject) => {
                            uploadTask.on('state_changed', 
                                (snapshot) => {
                                  // Observe state change events such as progress, pause, and resume
                                  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                  console.log('Upload is ' + progress + '% done');
                                  switch (snapshot.state) {
                                    case 'paused':
                                      console.log('Upload is paused');
                                      break;
                                    case 'running':
                                      console.log('Upload is running');
                                      break;
                                  }
                                }, 
                                (error) => {
                                  // Handle unsuccessful uploads
                                  console.log('Error uploading image', error);
                                  reject(error);
                                  
                                }, 
                                () => {
                                  // Handle successful uploads on complete
                                  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                    uploadedImages.push({
                                        ...item,
                                        image: downloadURL,
                                    })
                                    console.log('File available at', downloadURL);
                                    resolve();
                                  })
                                  .catch((error) => {
                                    console.log('Error getting the download URL', error);
                                    reject(error);
                                    
                                  });
                                }
                              );
                        })
                    }
                }
            } catch (error) {
                setIsLoading(false);
                console.log("Error handing image uploads", error);
                return toast.error("Error handing image uploads");
                
            }
        }

        // upload image to firebase storage
        await handleImageUploads();
        // save product into data
        const productData =  {...data, images: uploadedImages}
        axios.post('/api/product', productData).then(()=>{
            toast.success('Product created');
            setIsProductCreated(true);
            router.refresh();
        })
        .catch((error) => {
            console.log("Error: ", error);
            toast.error("Something went wrong when saving product to db")
        })
        .finally(() => {
            setIsLoading(false);
        })     
    }

    const category = watch("category");

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }

    const addImageToState = useCallback((value: ImageType)=>{
       setImages((prev) => {
         if(!prev) {
            return [value];
         }

         return [...prev, value];
       })
    }, []);

    const removeImageFromState = useCallback((value: ImageType)=>{
        setImages((prev) => {
          if(prev) {
             const filteredImages = prev.filter(
                (item) => item.color !== value.color
                );
            return filteredImages;
          }
          return prev;
        })
     }, []);

    return ( 
        <>
            <Heading title = "Add a Product"/>
            <Input 
            id="name"
            label="Name"
            disabled={isLoading}
            register={register}
            errors ={errors}
            required
            />
            <Input 
            id="price"
            label="Price"
            disabled={isLoading}
            register={register}
            errors ={errors}
            type="number"
            required
            />
            <Input 
            id="brand"
            label="Brand"
            disabled={isLoading}
            register={register}
            errors ={errors}
            required
            />
            <TextArea 
            id="description"
            label="Description"
            disabled={isLoading}
            register={register}
            errors ={errors}
            required
            />

            <CustomCheckBox 
            id="inStock"
            label="This Product is in stock"
            register={register}
            />

            <div className="w-full font-medium">
                <div className="mb-2 font-semibold">Select a Categoty</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h[50vh] overflow-y-auto">
                    {categories.map((item) => {

                        if(item.label ==="All") {
                            return null;
                        }
                        
                        return (
                            <div key= {item.label} 
                                 className = "col-span">
                                <CategoryInput 
                                    onClick ={(category) => setCustomValue("category", category)}
                                    selected={category === item.label}
                                    label={item.label}
                                    icon ={item.icon}
                                />
                            </div>
                        );
                        
                    })}
                </div>
            </div>
            <div className="w-full flex flex-col flex-wrap gap-4">
                <div>
                    <div className="font-bold">
                        Select the available product colors and upload their images.
                    </div>
                    <div className="text-sm">
                        You must upload an image for each of the color selected otherwise
                        your color selection will be ignored.
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {colors.map((item, index) => {
                        return(
                            <SelectColor
                                key={index}
                                item= {item}
                                addImageToState={addImageToState}
                                removeImageFromState={removeImageFromState}
                                isProductCreated={isProductCreated}
                            />
                        )
                    })}
                </div>
            </div>
            <Button 
                lable={isLoading ? 'Loading...' : 'Add Product'}
                onClick={handleSubmit(onSubmit)}
            />
        </>
     );
}
 
export default AddProductForm;