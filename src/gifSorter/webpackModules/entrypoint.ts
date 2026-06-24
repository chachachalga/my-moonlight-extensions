import { greeting } from "@moonlight-mod/wp/gifSorter_someLibrary";

const logger = moonlight.getLogger("gifSorter/entrypoint");
logger.info("Hello from entrypoint!");
logger.info("someLibrary exports:", greeting);

const natives = moonlight.getNatives("gifSorter");
logger.info("node exports:", natives);
