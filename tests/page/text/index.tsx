import React, { FC } from 'react';
import styles from './styles.module.less';

interface TextProps {
  text: string;
}

const Text: FC<TextProps> = (props) => {
  return <p className={styles.text}>{props.text}</p>;
};

export default Text;
