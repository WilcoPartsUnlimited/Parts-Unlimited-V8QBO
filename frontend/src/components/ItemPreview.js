import React, { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../agent";
import { connect } from "react-redux";
import { ITEM_FAVORITED, ITEM_UNFAVORITED } from "../constants/actionTypes";

const FAVORITED_CLASS = "btn btn-sm btn-primary";
const NOT_FAVORITED_CLASS = "btn btn-sm btn-outline-primary";
const IMAGE_PLACEHOLDER = 'placeholder.png';

const mapDispatchToProps = dispatch => ({
    favorite: slug =>
        dispatch({
            type: ITEM_FAVORITED,
            payload: agent.Items.favorite(slug)
        }),
    unfavorite: slug =>
        dispatch({
            type: ITEM_UNFAVORITED,
            payload: agent.Items.unfavorite(slug)
        })
});

const ItemPreview = ({ item, unfavorite, favorite }) => {
    const [imageSource, setImageSource] = useState(item.image);

    const favoriteButtonClass = item.favorited
        ? FAVORITED_CLASS
        : NOT_FAVORITED_CLASS;

    const handleClick = ev => {
        ev.preventDefault();
        if (item.favorited) {
            unfavorite(item.slug);
        } else {
            favorite(item.slug);
        }
    };

    const onImageError = () => {
        setImageSource(IMAGE_PLACEHOLDER);
    }

    return (
        <div className="card">
            <img src={imageSource} className="card-img-top item-img" onError={onImageError}/>
            <div className="card-body">
                <Link to={`/item/${item.slug}`} className="preview-link">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-text crop-text-3">{item.description}</p>
                </Link>
                <div className="d-flex flex-row align-items-center pt-2">
                    <Link to={`/@${item.seller.username}`} className="flex-grow-1">
                        <img
                            src={item.seller.image}
                            alt={item.seller.username}
                            className="user-pic pr-1"
                        />
                    </Link>
                    <button className="btn btn-outline-secondary" onClick={handleClick}>
                        <i className="ion-heart"/> {item.favoritesCount}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default connect(
    () => ({}),
    mapDispatchToProps
)(ItemPreview);
