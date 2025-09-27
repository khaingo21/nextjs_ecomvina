// Sử dụng kiểu từ @types/jquery
import 'jquery';

declare global {
  interface Window {
    jQuery: JQueryStatic;
    $: JQueryStatic;
  }
}

// Đảm bảo TypeScript nhận diện file này là một module
export {};
