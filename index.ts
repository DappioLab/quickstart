import * as fetcher from "./src/simple-fetcher";
import * as composer from "./src/simple-composer";

const main = async () => {
  await fetcher.fetch();
  await composer.composeAndSend();
};

main();

export {};
