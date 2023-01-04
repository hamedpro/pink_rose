import hashes from "jshashes"
import { sum_array, unique_items_of_array } from "../common_helpers.js";
var md5_hash_instance = new hashes.MD5
console.log(md5_hash_instance.hex("hamed is here"));
console.log(unique_items_of_array([1, 1, 2, 3, 4, 5, 5, 6, 7, 7]));