import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiChevronDown } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";
import { insertProduct } from "../redux/productsSlice";
import { CgSpinner } from "react-icons/cg";
import DangerToast from "../components/toasts/DangerToast";
import { fetchCategories } from "../redux/categoriesSlice";

const className = (...classes) => {
    return classes.filter(Boolean).join(" ");
};

const AddProduct = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { process } = useSelector((state) => state.products);
    const [formValue, setFormValue] = useState({
        name: "",
        price: 0,
        category: "",
        description: "",
    });
    const [formData, setFormData] = useState("");
    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { categories } = useSelector(
        (state) => state.categories
    );
    const [formCategory, setFormCategory] = useState([]);

    const [picture, setPicture] = useState([])

    const onFileChange = (e) => {
        const file = e.target.files;
        const fileArray = Array.from(file)
        if (file.length > 4) {
            setShow(true);
            setErrorMessage("Gambar Tidak Boleh Lebih Dari 4");
        } else {
            const imageArray = fileArray.map((file) => {
                return URL.createObjectURL(file)
            })
            for (let index of file) {
                formData.append("pictures", index);
            }
            setPicture(imageArray);
        }
    };

    const onChange = (e) => {
        setFormValue({
            ...formValue,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();

        formData.set("name", formValue.name);
        formData.set("price", formValue.price);
        formData.set("category", formValue.category);
        formData.set("description", formValue.description);

        dispatch(insertProduct({ formData, process, navigate }));
    };

    useEffect(() => {
        setFormData(new FormData());
        categories && setFormCategory(categories);
    }, [categories]);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <>
            {errorMessage && <DangerToast show={show} message={errorMessage} />}
            <div className="mx-auto mt-4 flex w-full justify-between sm:mt-10 md:w-full lg:w-[1024px]">
                <div className="hidden sm:ml-10 sm:mr-10 sm:block lg:mr-20">
                    <FiArrowLeft
                        className="cursor-pointer text-3xl"
                        onClick={() => {
                            navigate(-1);
                        }}
                    />
                </div>
                <form className="w-full space-y-4 px-5" onSubmit={onSubmit}>
                    <div className="space-y-2">
                        <label className="block">Nama Produk</label>
                        <input
                            className="w-full rounded-2xl border border-neutral-02 py-3 px-4 placeholder:text-neutral-03 focus:outline-none"
                            type="text"
                            placeholder="Nama Produk"
                            name="name"
                            onChange={onChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block">Harga Produk</label>
                        <input
                            className="w-full rounded-2xl border border-neutral-02 py-3 px-4 placeholder:text-neutral-03 focus:outline-none"
                            type="number"
                            placeholder="Rp 0,00"
                            name="price"
                            onChange={onChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block">Category</label>
                        <label className="relative block">
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-03">
                                <FiChevronDown />
                            </span>
                            <select
                                className=" bg-neutral-01 w-full appearance-none rounded-2xl border border-neutral-02 py-3 pr-10 pl-3 focus:outline-none"
                                name="category"
                                onChange={onChange}
                            >
                                <option value="">Pilih Kategori</option>
                                {formCategory.map((category) => (
                                    <option value={category} key={category}>{category}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="space-y-2">
                        <label className="block">Deskripsi</label>
                        <textarea
                            name="description"
                            rows="2"
                            className="bg-neutral-01 w-full resize-none rounded-2xl border border-neutral-02 py-3 px-4 placeholder:text-neutral-03 focus:outline-none"
                            placeholder="Contoh: Jalan Ikan Hiu 33"
                            onChange={onChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block">Foto Produk</label>
                        <div className="flex flex-wrap">
                            {picture &&
                                picture.map((image) => (
                                    <img key={image} src={image} alt="" className="h-24 w-24 object-contain mr-4" />
                                ))
                            }
                            <label
                                className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-neutral-02 text-2xl text-neutral-03"
                                htmlFor="file"
                            >
                                <input
                                    className="hidden h-full w-full"
                                    type="file"
                                    id="file"
                                    name="pictures"
                                    accept="image/png, image/jpeg, image/jpg"
                                    multiple
                                    onChange={onFileChange}
                                />
                                <FiPlus />
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button className="sm:w-74 w-[48%] rounded-xl border border-primary-purple-04 py-3 font-medium hover:bg-primary-purple-05 hover:text-white">
                            Preview
                        </button>
                        <button
                            className={className(
                                process === "pending"
                                    ? "flex items-center justify-center gap-2"
                                    : "",
                                "sm:w-74 w-[48%] rounded-xl bg-primary-purple-04 py-3 font-medium text-white hover:bg-primary-purple-05"
                            )}
                            type="submit"
                        >
                            {process === "pending" ? (
                                <>
                                    <CgSpinner className="animate-spin" />
                                    <span>Adding...</span>
                                </>
                            ) : (
                                <span>Terbitkan</span>
                            )}
                        </button>
                    </div>
                </form>
                <div className="hidden h-[30px] w-[30px] sm:ml-10 sm:mr-10 sm:block lg:ml-20"></div>
            </div>
        </>
    );
};

export default AddProduct;
