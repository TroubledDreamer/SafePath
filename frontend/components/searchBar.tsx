

import { View, StyleSheet, Text } from 'react-native';
import UIInput from './ui/UIInput';
import SearchList from './searchList';
import { useRouter } from 'expo-router';
import UIButton from './ui/UIButton';
const SearchBar = () => {
      const router = useRouter();





    const handleSelect = () => {
            router.push({
    pathname: '/(tabs)/trip',
    params: {
        origin: '45.815,15.981',
        destination: '45.803,15.977',
        mode: 'DRIVING',
    },
    });

}





    

    return (
        <View>


        

            <UIInput/>

            <SearchList/>

            <UIButton
            title='sub'
            onPress={handleSelect}/>


            








            

            



        </View>
    )


    

};

const styles = StyleSheet.create({

});

export default SearchBar;