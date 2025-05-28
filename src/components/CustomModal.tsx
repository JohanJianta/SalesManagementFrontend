import { Modal, ModalProps, KeyboardAvoidingView, View, Platform } from "react-native";

type Props = ModalProps & {
  isOpen: boolean;
  withInput?: boolean;
};

export default function CustomModal({ isOpen, withInput, children, ...rest }: Props) {
  const content = withInput ? (
    <KeyboardAvoidingView
      className="items-center justify-center flex-1 px-3 bg-zinc-900/40"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View className="items-center justify-center flex-1 px-3 bg-zinc-900/40">{children}</View>
  );

  return (
    <Modal visible={isOpen} transparent animationType="fade" statusBarTranslucent {...rest}>
      {content}
    </Modal>
  );
}
