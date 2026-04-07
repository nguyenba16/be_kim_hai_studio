export function removeVietnameseTones(str) {
  str = str.toLowerCase();

  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");

  // Loại bỏ dấu câu, khoảng trắng dư
  str = str.replace(/\s+/g, " ").trim();
  str = str.replace(/[^a-z0-9\s]/g, "");

  return str;
}

export function toSlug(str) {
  str = str.toLowerCase().trim();

  // remove dấu
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");

  // loại bỏ ký tự đặc biệt
  str = str.replace(/[^a-z0-9\s-]/g, "");

  // thay khoảng trắng thành dấu -
  str = str.replace(/\s+/g, "-");

  // loại bỏ dấu - dư
  str = str.replace(/-+/g, "-");
  str = str.replace(/^-+|-+$/g, "");

  return str;
}

export function parseISODate(dateStr) {
  if (!dateStr) return null;

  // chấp nhận YYYY-MM-DD hoặc YYYY/MM/DD
  const normalized = dateStr.replace(/\//g, "-");
  const date = new Date(normalized);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid deadline_date format");
  }

  return date;
}
