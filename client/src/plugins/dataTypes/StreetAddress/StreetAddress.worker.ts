import utils from '../../../utils';
import { DTWorkerGenerationData, DTGenerateResult, DTWorkerOnMessage } from '~types/dataTypes';

const getWords = () => {
	const { words } = utils.stringUtils.getLipsumWords();
	return words;
};

export const generate = ({ i18n }: DTWorkerGenerationData): DTGenerateResult => {
	const { streetTypes, poBox, apNum } = i18n;
	const streetName = utils.stringUtils.uppercaseWords(utils.randomUtils.generateRandomTextStr(getWords(), false, 1));
	const streetType = utils.randomUtils.getRandomArrayValue(streetTypes.split(','));

	const format = utils.randomUtils.getRandomNum(1, 4);
	let streetAddress = '';

	switch (format) {
		case 1:
			streetAddress = `${poBox} ${utils.randomUtils.getRandomNum(100, 999)}, ${utils.randomUtils.getRandomNum(100, 9999)} ${streetName} ${streetType}`;
			break;
		case 2:
			streetAddress = `${utils.randomUtils.getRandomNum(100, 999)}-${utils.randomUtils.getRandomNum(100, 9999)} ${streetName} ${streetType}`;
			break;
		case 3:
			streetAddress = `${apNum}${utils.randomUtils.getRandomNum(100, 999)}-${utils.randomUtils.getRandomNum(100, 9999)} ${streetName} ${streetType}`;
			break;
		case 4:
			streetAddress = `${utils.randomUtils.getRandomNum(100, 9999)} ${streetName} ${streetType}`;
			break;
	}

	return {
		display: streetAddress
	};
};

let workerUtilsLoaded = false;

export const onmessage = (e: DTWorkerOnMessage) => {
	if (!workerUtilsLoaded) {
		importScripts(e.data.workerUtilsUrl);
		workerUtilsLoaded = true;
	}

	postMessage(generate(e.data));
};
