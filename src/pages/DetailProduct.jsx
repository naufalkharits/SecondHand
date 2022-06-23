import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { deleteProduct, fetchProductById, productsSelectors } from "../redux/productsSlice";
import ProfileCard from "../components/ProfileCard";
import { AiOutlineHeart } from "react-icons/ai";

const DetailProduct = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const dispatch = useDispatch();
    const product = useSelector((state) =>
        productsSelectors.selectById(state, productId)
    );

    const handleDelete = (e) => {
        e.preventDefault();

        dispatch(deleteProduct(productId))

        navigate("/manage-product");
    }

    useEffect(() => {
        dispatch(fetchProductById(productId));
    }, [productId, dispatch]);

    return (
        <>
            <div
                className="container mx-auto p-4 xl:px-32 2xl:px-64"
                key={product?.id}
            >
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="space-y-4 sm:w-2/3 lg:w-3/4">
                        <Carousel
                            infiniteLoop
                            emulateTouch={true}
                            showThumbs={false}
                            showStatus={false}
                        >
                            <img
                                className="w-full rounded-2xl"
                                src={product?.pictures[0]}
                                alt=""
                            />
                            <img
                                className="w-full rounded-2xl"
                                src={product?.pictures[1]}
                                alt=""
                            />
                            <img
                                className="w-full rounded-2xl"
                                src={product?.pictures[2]}
                                alt=""
                            />
                        </Carousel>
                        <div className="hidden space-y-4 rounded-2xl border border-neutral-200 p-4 shadow sm:block">
                            <div className="font-medium">Deskripsi</div>
                            <p className="text-sm text-neutral-03">
                                {product?.description}
                            </p>
                            <p className="text-sm text-neutral-03">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Asperiores consequatur
                                incidunt, nobis dolore, minus rerum, nisi unde
                                sint corrupti suscipit obcaecati dolores odio
                                qui ut error eius iusto alias deleniti?
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4 sm:w-1/3 sm:space-y-6 lg:w-1/4">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-md">
                            <div className="mb-4 space-y-2">
                                <div>{product?.name}</div>
                                <div className="text-sm text-neutral-03">
                                    {product?.category}
                                </div>
                            </div>
                            <div className="mb-6">Rp. 250.000</div>
                            <button className="mb-4 hidden w-full rounded-2xl bg-primary-purple-04 p-2 text-white hover:bg-primary-purple-05 sm:block">
                                Terbitkan
                            </button>
                            <button
                                className="mb-4 hidden w-full rounded-2xl border border-primary-purple-04 p-2 text-primary-purple-04 hover:bg-primary-purple-05 hover:text-white sm:block"
                                onClick={() => {
                                    navigate(
                                        `/manage-product/edit/${product?.id}`
                                    );
                                }}
                            >
                                Edit
                            </button>
                            <button
                                className="hidden w-full rounded-2xl bg-alert-danger p-2 text-white hover:bg-red-700 sm:block"
                                onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                        <ProfileCard />
                        <div className="flex items-center justify-center rounded-2xl border border-neutral-200 p-4 shadow">
                            <AiOutlineHeart />
                        </div>
                    </div>
                    <div className="space-y-4 rounded-2xl border border-neutral-200 p-4 shadow sm:hidden">
                        <div className="font-medium">Deskripsi</div>
                        <p className="text-sm text-neutral-03">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Tempora nostrum nisi labore nesciunt
                            necessitatibus, debitis quibusdam veritatis. Ratione
                            impedit architecto maxime dolores in commodi
                            praesentium repellat, soluta vel odit id!
                        </p>
                        <p className="text-sm text-neutral-03">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Asperiores consequatur incidunt, nobis dolore,
                            minus rerum, nisi unde sint corrupti suscipit
                            obcaecati dolores odio qui ut error eius iusto alias
                            deleniti?
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailProduct;
