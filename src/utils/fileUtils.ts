import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { Screens } from '../constants/Constants';

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
  console.log('Download function called with URL:', fileUrl);
  
  try {
    const {fs} = RNFetchBlob;
    const fileDir = fs.dirs.CacheDir;
    const filePath = `${fileDir}/${fileName}${fileExtension}`;
    
    console.log('Attempting download to path:', filePath);
    
    const config = {
      fileCache: true,
      path: filePath,
    };
    
    console.log('Download config:', config);
    
    // Use a direct promise approach without progress tracking
    return new Promise((resolve, reject) => {
      RNFetchBlob.config(config)
        .fetch('GET', fileUrl)
        .then(response => {
          if (response.info().status === 200) {
            resolve({
              success: true,
              filePath: Platform.OS === 'ios' ? filePath : `file://${filePath}`,
            });
          } else {
            reject(new Error(`Download failed with status: ${response.info().status}`));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  } catch (error) {
    console.error('Error in downloadFile:', error);
    return {success: false, error};
  }
};

