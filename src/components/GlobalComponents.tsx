import {
  DocumentPickerResponse,
  pick,
  types,
} from '@react-native-documents/picker';
import {Picker} from '@react-native-picker/picker';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {Dispatch, FC, ReactNode, SetStateAction, useState} from 'react';
import {
  DimensionValue,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import DatePicker from 'react-native-date-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../constants/Constants';
import {sanitizeInput} from '../utils/helper';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  color?: string;
  borderRadius?: number;
  width?: undefined | DimensionValue;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  fontSize?: number;
  fontWeight?:
    | 'bold'
    | 'normal'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  shadowColor?: string;
  shadowOffset?: {width: number; height: number};
  shadowOpacity?: number;
  elevation?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dotted' | 'dashed';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  disabled?: boolean;
};

const CustomButton: FC<CustomButtonProps> = ({
  title,
  disabled = false,
  onPress,
  color = disabled ? Colors.gray : Colors.white,
  borderRadius = 10,
  width = '100%',
  padding = 12,
  paddingHorizontal = 12,
  paddingVertical = 12,
  fontSize = 18,
  fontWeight = 'bold',
  shadowColor = Colors.black,
  shadowOffset = {width: 0, height: 2},
  shadowOpacity = 0.25,
  elevation = 5,
  backgroundColor = disabled ? Colors.muted : Colors.primary,
  borderColor = Colors.transparent,
  borderWidth = 2,
  borderStyle = 'solid',
  alignItems = 'center',
  ...style
}) => {
  const buttonStyles = StyleSheet.create({
    button: {
      backgroundColor,
      borderRadius,
      width,
      padding,
      paddingHorizontal,
      paddingVertical,
      alignItems,
      shadowColor,
      shadowOffset,
      shadowOpacity,
      elevation,
      borderColor,
      borderWidth,
      borderStyle,
    },
    text: {
      color,
      fontWeight,
      fontSize,
    },
    ...style,
  });

  return (
    <TouchableOpacity
      style={buttonStyles.button}
      onPress={onPress}
      disabled={disabled}>
      <Text style={buttonStyles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

type CustomeSafeAreaViewProps = {
  children: ReactNode | undefined;
  containerStyle?: object;
  contentContainerStyle?: object;
  tabHeader?: string;
  navigation?: Omit<NavigationProp<ReactNavigation.RootParamList>, 'jumpTo'>;
  rightText?: string;
  rightTextClick?: () => void;
};

const CustomSafeAreaView: FC<CustomeSafeAreaViewProps> = ({
  children,
  containerStyle,
  contentContainerStyle,
  tabHeader,
  navigation,
  rightText,
  rightTextClick,
  ...props
}) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.light,
      position: 'relative',
      ...containerStyle,
    },
    contentContainer: {
      ...contentContainerStyle,
    },
  });
  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.contentContainer, contentContainerStyle]}>
        {tabHeader && (
          <TabHeader
            title={tabHeader}
            leftIconClick={() => navigation?.goBack()}
            rightText={rightText}
            rightTextClick={rightTextClick || (() => {})}
            {...props}
          />
        )}
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

type LinkTextProps = {
  text?: string;
  linkText: string | undefined;
  onPress?: () => void;
};

const LinkText: FC<LinkTextProps> = ({text, linkText, onPress}) => {
  return (
    <View style={{flexDirection: 'row', columnGap: 5}}>
      <Text>{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={{color: Colors.primary, fontWeight: 'bold'}}>
          {linkText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

type CustomInputProps = {
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onChangeText?: (text: string) => void;
  value?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  onleftIconClick?: () => void;
  onRightIconClick?: () => void;
  error?: string;
  onBlur?: (e: any) => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  backgroundColor?: string;
  boxPadding?: number;
  onInputFocus?: () => void;
  editable?: boolean;
  multiline?: boolean;
  noOflines?: number;
  autoCorrect?: boolean;
};

const CustomInput: FC<CustomInputProps> = ({
  label,
  placeholder,
  leftIcon,
  rightIcon,
  onChangeText,
  value = '',
  keyboardType,
  onleftIconClick,
  onRightIconClick,
  error,
  onBlur,
  autoCapitalize = 'words',
  backgroundColor = Colors.white,
  boxPadding = 10,
  onInputFocus,
  editable = true,
  multiline = false,
  noOflines = 1,
  secureTextEntry = false,
  ...props
}) => {
  const styles = StyleSheet.create({
    label: {
      fontSize: 16,
      color: Colors.current,
      marginBottom: 10,
      fontWeight: 'bold',
      alignSelf: 'flex-start',
    },
    inputBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: backgroundColor,
      padding: boxPadding,
      borderRadius: 10,
      width: '100%',
    },
    textInput: {
      flex: 1,
      paddingVertical: 3,
    },
    errorText: {
      color: Colors.danger,
      fontSize: 12,
      marginTop: 5,
    },
  });

  const handleTextChange = (text: string) => {
    if (onChangeText) {
      const sanitizedText = text ? sanitizeInput(text) : '';
      onChangeText(sanitizedText);
    }
  };

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        {leftIcon && (
          <MaterialIcons
            name={leftIcon}
            size={24}
            color={Colors.gray}
            onPress={onleftIconClick}
          />
        )}
        <TextInput
          autoCapitalize={autoCapitalize}
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={Colors.muted}
          onChangeText={handleTextChange}
          value={value}
          keyboardType={keyboardType}
          onBlur={onBlur}
          onFocus={onInputFocus}
          editable={editable}
          multiline={multiline}
          numberOfLines={noOflines}
          secureTextEntry={secureTextEntry}
          passwordRules={
            secureTextEntry
              ? 'minlength: 8; required: lower; required: upper; required: digit;'
              : undefined
          }
          {...props}
        />
        {rightIcon && (
          <MaterialIcons
            name={rightIcon}
            size={24}
            color={Colors.gray}
            onPress={onRightIconClick}
          />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

type CustomDatePickerProps = {
  label?: string;
  error?: string;
  backgroundColor?: string;
  boxPadding?: number;
  onDateChange: (date: Date) => void;
  isVisible: boolean;
  onClose: () => void;
  currentDate: Date;
  minimumDate?: Date;
  maximumDate?: Date;
};

const CustomDatePicker: FC<CustomDatePickerProps> = ({
  label,
  error,
  backgroundColor = Colors.white,
  onDateChange,
  isVisible,
  onClose,
  currentDate,
  minimumDate,
  maximumDate,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            backgroundColor: Colors.white,
            padding: 20,
            borderRadius: 10,
            width: '90%',
          }}>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 15}}>
            {label}
          </Text>
          <DatePicker
            date={currentDate}
            onDateChange={onDateChange}
            mode="date"
            maximumDate={maximumDate}
            minimumDate={minimumDate}
          />
          <CustomButton title="OK" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

type CustomPickerProps = {
  label: string;
  selectedItem: string;
  setSelectedItem: Dispatch<SetStateAction<string>>;
  itemsList: Array<{label: string; value: string}>;
  onValueChange: (itemValue: string, itemIndex: number) => void;
  backgroundColor?: string;
};

const CustomPicker: FC<CustomPickerProps> = ({
  label,
  selectedItem,
  setSelectedItem,
  itemsList,
  onValueChange,
  backgroundColor = Colors.white,
}) => {
  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
    selectBox: {
      paddingHorizontal: 10,
      borderRadius: 10,
      width: '100%',
      backgroundColor: backgroundColor,
      paddingInline: 10,
    },
    labelStyle: {
      fontSize: 16,
      color: Colors.current,
      marginBottom: 10,
      fontWeight: 'bold',
      alignSelf: 'flex-start',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.labelStyle}>{label}</Text>
      <View style={styles.selectBox}>
        <Picker selectedValue={selectedItem} onValueChange={onValueChange}>
          {itemsList.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

type SectionProps = {
  title: string;
  children: ReactNode;
  style?: object;
  link?: string;
  handleClick?: () => void;
};

const CustomSection: FC<SectionProps> = ({
  title,
  children,
  style,
  link,
  handleClick,
}) => {
  const styles = StyleSheet.create({
    container: {
      width: '97%',
      padding: 20,
      backgroundColor: Colors.white,
      elevation: 5,
      borderRadius: 10,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.black,
    },
    ...style,
  });

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <LinkText linkText={link} onPress={handleClick} />
      </View>
      {children}
    </View>
  );
};

type CustomSectionItemsProps = {
  itemIcon: string;
  itemTitle: string;
  itemSubtitle?: string;
  itemStatus?: 'Pending' | 'Completed' | 'In Progress' | 'N/A' | string;
  itemStatusTextColor?: string;
  itemStatusBackgroundColor?: string;
  itemStatusBorderRadius?: number;
  iconColor?: string;
};

const CustomSectionItems: FC<CustomSectionItemsProps> = ({
  itemIcon,
  itemTitle,
  itemSubtitle,
  itemStatus,
  itemStatusTextColor = Colors.white,
  itemStatusBackgroundColor = Colors.primary,
  itemStatusBorderRadius = 20,
  iconColor = Colors.primary,
}) => {
  const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: 10,
      backgroundColor: Colors.light,
      borderRadius: 10,
      marginBottom: 10,
      gap: 10,
    },
  });

  return (
    <View>
      <View style={styles.itemContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <MaterialIcons name={itemIcon} size={30} color={iconColor} />
          <View>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {' '}
              {itemTitle}{' '}
            </Text>
            <Text style={{fontSize: 12, color: Colors.muted}}>
              {itemSubtitle}
            </Text>
          </View>
        </View>
        {itemStatus && (
          <View
            style={{
              backgroundColor: `${
                itemStatus === 'Pending'
                  ? Colors.primary
                  : itemStatus === 'Completed'
                  ? Colors.green
                  : itemStatus === 'In Progress'
                  ? Colors.secondary
                  : Colors.transparent
              }`,
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: itemStatusBorderRadius,
            }}>
            {itemStatus !== 'N/A' && (
              <Text style={{color: itemStatusTextColor}}>{itemStatus}</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

type TabHeaderProps = {
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  leftIconClick?: () => void;
  rightIconClick?: () => void;
  style?: object;
  leftIconColor?: string;
  rightIconColor?: string;
  leftIconSize?: number;
  rightIconSize?: number;
  titleColor?: string;
  titleSize?: number;
  leftText?: string;
  rightText?: string;
  leftTextColor?: string;
  rightTextColor?: string;
  leftTextSize?: number;
  rightTextSize?: number;
  leftTextClick?: () => void;
  rightTextClick?: () => void;
  leftTextFontWeight?:
    | 'bold'
    | 'normal'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  rightTextFontWeight?:
    | 'bold'
    | 'normal'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
};

const TabHeader: FC<TabHeaderProps> = ({
  title,
  leftIcon = 'arrow-back',
  rightIcon,
  leftIconClick,
  rightIconClick,
  style,
  leftIconColor = Colors.white,
  rightIconColor = Colors.white,
  leftIconSize = 24,
  rightIconSize = 24,
  titleColor = Colors.white,
  titleSize = 20,
  leftText,
  rightText,
  leftTextColor = Colors.white,
  rightTextColor = Colors.white,
  leftTextSize = 16,
  rightTextSize = 16,
  leftTextClick,
  rightTextClick,
  leftTextFontWeight = 'bold',
  rightTextFontWeight = 'bold',
  ...props
}) => {
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    headerContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      backgroundColor: Colors.primary,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.white,
      flex: 1,
      textAlign: 'center',
    },
    ...style,
  });

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity>
        {leftIcon && (
          <MaterialIcons
            name={leftIcon}
            size={leftIconSize}
            color={leftIconColor}
            onPress={leftIconClick}
          />
        )}
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>

      {rightText && (
        <TouchableOpacity onPress={rightTextClick}>
          <Text
            style={{
              color: rightTextColor,
              fontSize: rightTextSize,
              fontWeight: rightTextFontWeight,
            }}>
            {rightText}
          </Text>
        </TouchableOpacity>
      )}

      {rightIcon && (
        <TouchableOpacity>
          <MaterialIcons
            name={rightIcon}
            size={rightIconSize}
            color={rightIconColor}
            onPress={rightIconClick}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const Divider: FC = () => {
  return (
    <View
      style={{
        width: '100%',
        height: 1.7,
        backgroundColor: Colors.lightGray,
        marginVertical: 5,
      }}
    />
  );
};

type UploadResourceBtnProps = {
  handleUploadClick: () => void;
};

const UploadResourceBtn: FC<UploadResourceBtnProps> = ({handleUploadClick}) => {
  const styles = StyleSheet.create({
    uploadResourceBtn: {
      width: 65,
      aspectRatio: 1,
      borderRadius: 100,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 5,
      right: 15,
    },
    uploadResourceBtnText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <TouchableOpacity
      style={styles.uploadResourceBtn}
      onPress={handleUploadClick}>
      <MaterialIcons name="add" size={40} color={Colors.white} />
    </TouchableOpacity>
  );
};

type UploaderButtonProps = {
  file: DocumentPickerResponse | undefined;
  setFile: Dispatch<SetStateAction<DocumentPickerResponse | undefined>>;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
};

const UploaderButton: FC<UploaderButtonProps> = ({
  file,
  setFile,
  setModalVisible,
}) => {
  const handleChooseFile = async () => {
    try {
      const [pickResult] = await pick({
        type: types.pdf,
      });
      setFile(pickResult);
      console.log(pickResult);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      console.log('No file selected');
      return;
    }
    console.log('File selected');
    console.log(file);
    setModalVisible(false);
  };

  return !file ? (
    <CustomButton
      title="Choose File"
      onPress={handleChooseFile}
      width={'45%'}
    />
  ) : (
    <CustomButton
      title="Upload"
      onPress={handleSubmit}
      width={'45%'}
      backgroundColor={Colors.green}
    />
  );
};

export {
  CustomButton,
  CustomDatePicker,
  CustomInput,
  CustomPicker,
  CustomSafeAreaView,
  CustomSection,
  CustomSectionItems,
  Divider,
  LinkText,
  TabHeader,
  UploaderButton,
  UploadResourceBtn,
};
