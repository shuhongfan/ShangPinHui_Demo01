import Mock from "mockjs";
import banner from './banners.json'
import floor from './floors.json'

Mock.mock("/mock/banner",{code:200,data:banner})
Mock.mock("/mock/floor",{code:200,data:floor})
