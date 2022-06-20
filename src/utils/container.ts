import {FlatList, View} from 'react-native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

export const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
export const AnimatedShimmerPlaceholder =
  Animated.createAnimatedComponent(ShimmerPlaceholder);
export const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
export const AnimatedHeaderComponent =
  Animated.createAnimatedComponent(LinearGradient);
export const AnimatedView = Animated.createAnimatedComponent(View);
export const AnimatedIcon = Animated.createAnimatedComponent(
  MaterialCommunityIcons,
);
