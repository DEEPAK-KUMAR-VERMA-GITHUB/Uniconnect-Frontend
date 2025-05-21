import RNFetchBlob from 'rn-fetch-blob';
import {Screens} from '../constants/Constants';
import {Platform} from 'react-native';

export const viewPdf = async (
  navigation: any,
  fileUrl: string,
  fileName: string,
) => {
  try {
    // get the directory for temporary files
    const {fs} = RNFetchBlob;
    const fileDir = fs.dirs.CacheDir;
    const filePath = `${fileDir}/${fileName}.pdf`;

    // Download the file
    const response = await RNFetchBlob.config({
      fileCache: true,
      path: filePath,
    }).fetch('GET', fileUrl);

    console.log(response);

    if (response.info().status === 200) {
      // Navigate to PDF Viewer
      navigation.navigate(Screens.PdfViewer, {
        url: Platform.OS === 'ios' ? filePath : `file://${filePath}`,
        title: fileName,
      });
      return true;
    } else {
      throw new Error('Failed to download file');
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    return false;
  }
};

export const downloadFile = async (
  fileUrl: string,
  fileName: string,
  fileExtension: string = '.pdf',
) => {
  try {
    const {fs} = RNFetchBlob;
    const fileDir = fs.dirs.CacheDir; // Using cache directory instead of Downloads
    const filePath = `${fileDir}/${fileName}${fileExtension}`;

    const response = await RNFetchBlob.config({
      fileCache: true,
      path: filePath,
    }).fetch('GET', fileUrl);

    if (response.info().status === 200) {
      console.log('File downloaded successfully to cache:', filePath);
      return {
        success: true,
        filePath: Platform.OS === 'ios' ? filePath : `file://${filePath}`,
      };
    } else {
      throw new Error(`Download failed with status: ${response.info().status}`);
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    return {success: false, error};
  }
};
