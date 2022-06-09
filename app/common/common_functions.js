function getUrlAddedImages(images) {
    images = images.map(function (image_detail) {
        image_detail.image_url = process.env.IMAGE_ACCESS_URL_PREFIX + "" + image_detail.file_name
        return image_detail
    });
    return images;
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function getEndDay( month) {
    if(month == 1)
    return 31;
    else if(month == 2)
    return 29;
    else if(month == 3)
    return 31;
    else if(month == 4)
    return 30;
    else if(month == 5)
    return 31;
    else if(month == 6)
    return 30;
    else if(month == 7)
    return 31;
    else if(month == 8)
    return 31;
    else if(month == 9)
    return 30;
    else if(month == 10)
    return 31;
    else if(month == 11)
    return 30;
    else if(month == 12)
    return 31;
}

module.exports = {
    getUrlAddedImages,
    getAge,
    getEndDay,
};