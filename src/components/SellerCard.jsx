import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getBiodata } from "../redux/authSlice";
import AltFoto from "../images/AltFoto.png";

const SellerCard = () => {
    const dispatch = useDispatch();
    const { biodata, decodedAccess, loading } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        decodedAccess && dispatch(getBiodata(decodedAccess.id));
    }, [decodedAccess, dispatch]);

    return (
        <div className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4 shadow">
            <div className="flex items-center gap-4">
                {loading === "pending" ? (
                    <div className="h-12 w-12 animate-pulse rounded-xl bg-gray"></div>
                ) : (
                    <img
                        src={biodata?.picture || AltFoto}
                        alt=""
                        className="h-12 w-12 rounded-xl"
                    />
                )}

                <div className="space-y-1">
                    <div
                        className={
                            loading === "pending"
                                ? "h-3 w-16 animate-pulse rounded-md bg-gray"
                                : ""
                        }
                    >
                        {biodata?.name}
                    </div>
                    <div
                        className={
                            loading === "pending"
                                ? "h-2 w-12 animate-pulse rounded-md bg-gray"
                                : "text-xs text-neutral-03"
                        }
                    >
                        {biodata?.city}
                    </div>
                </div>
            </div>
            {loading === "pending" ? (
                <></>
            ) : (
                <Link
                    to="/user/profile"
                    className="rounded-lg border border-primary-purple-04 bg-white py-1 px-3 text-neutral-05 hover:bg-primary-purple-05 hover:text-white"
                >
                    Edit
                </Link>
            )}
        </div>
    );
};

export default SellerCard;
