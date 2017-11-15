import Inferno from 'inferno';
import PropTypes from 'prop-types';

import {IPAField} from './IPAField';

export const IPATable = (values) => {
  PropTypes.checkPropTypes({
    value: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
  }, values, 'value', 'IPATable');
/*
  Modified from KeyboardFire's Phondue project (https://github.com/KeyboardFire/phondue)
  to fit React/Inferno and Lexiconga
*/

  const {
    value,
    close,
    update
  } = values;

  const updateInput = (newValue) => {
    update(value + newValue);
  }

  return (
    <div className='modal is-active'>
      <div className='modal-background'
        onClick={ () => close() } />
      <div className='modal-card'>

        <header className='modal-card-head'>
          <h2 className='modal-card-title'>
            Pronunciation: { value }
          </h2>

          <button className='delete'
            onClick={ () => close() } />
        </header>

        <section className='modal-card-body'>
          <p>
            <em>Hover over characters to see their Phondue shortcuts.</em>
          </p>
          <table className='table is-bordered'>
            <thead>
              <tr>
                <th id='cell_0_0' class='td-lbl' colspan={ 1 } />
                <th id='cell_0_1' class='td-lbl' colspan={ 2 }>
                    Bilabial
                </th>
                <th id='cell_0_2' class='td-lbl' colspan={ 2 }>
                    Labiodental
                </th>
                <th id='cell_0_3' class='td-lbl' colspan={ 2 }>
                    Dental
                </th>
                <th id='cell_0_4' class='td-lbl' colspan={ 2 }>
                    Alveolar
                </th>
                <th id='cell_0_5' class='td-lbl' colspan={ 2 }>
                    Postalveolar
                </th>
                <th id='cell_0_6' class='td-lbl' colspan={ 2 }>
                    Palatal
                </th>
                <th id='cell_0_7' class='td-lbl' colspan={ 2 }>
                    Velar
                </th>
                <th id='cell_0_8' class='td-lbl' colspan={ 2 }>
                    Uvular
                </th>
                <th id='cell_0_9' class='td-lbl' colspan={ 2 }>
                    Pharyngeal
                </th>
                <th id='cell_0_10' class='td-lbl' colspan={ 2 }>
                    Glottal
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th id='cell_1_0' class='td-lbl' colspan={ 1 }>
                    Plosive
                </th>
                <td id='cell_1_1' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    p
                  </button>
                </td>
                <td id='cell_1_2' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    b
                  </button>
                </td>
                <td id='cell_1_3' class='td-lbl'>
                </td>
                <td id='cell_1_4' class='td-lbl'>
                </td>
                <td id='cell_1_5' class='td-lbl'>
                </td>
                <td id='cell_1_6' class='td-lbl'>
                </td>
                <td id='cell_1_7' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    t
                  </button>
                </td>
                <td id='cell_1_8' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    d
                  </button>
                </td>
                <td id='cell_1_9' class='td-lbl'>
                </td>
                <td id='cell_1_10' class='td-lbl'>
                </td>
                <td id='cell_1_11' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    c
                  </button>
                </td>
                <td id='cell_1_12' class='td-btn'>
                  <button title='-J -j J- j- ʄ('
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɟ
                  </button>
                </td>
                <td id='cell_1_13' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    k
                  </button>
                </td>
                <td id='cell_1_14' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    g
                  </button>
                </td>
                <td id='cell_1_15' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    q
                  </button>
                </td>
                <td id='cell_1_16' class='td-btn'>
                  <button title='GG ʛ('
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɢ
                  </button>
                </td>
                <td id='cell_1_17' class='td-lbl'>
                </td>
                <td id='cell_1_18' class='td-lbl grey'>
                </td>
                <td id='cell_1_19' class='td-btn'>
                  <button title='-ʡ ?? ʕ/ ʡ-'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʔ
                  </button>
                </td>
                <td id='cell_1_20' class='td-lbl grey'>
                </td>
              </tr>
              <tr>
                <th id='cell_2_0' class='td-lbl' colspan={ 1 }>
                    Nasal
                </th>
                <td id='cell_2_1' class='td-lbl'>
                </td>
                <td id='cell_2_2' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    m
                  </button>
                </td>
                <td id='cell_2_3' class='td-lbl'>
                </td>
                <td id='cell_2_4' class='td-btn'>
                  <button title='M, m,'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɱ
                  </button>
                </td>
                <td id='cell_2_5' class='td-lbl'>
                </td>
                <td id='cell_2_6' class='td-lbl'>
                </td>
                <td id='cell_2_7' class='td-lbl'>
                </td>
                <td id='cell_2_8' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    n
                  </button>
                </td>
                <td id='cell_2_9' class='td-lbl'>
                </td>
                <td id='cell_2_10' class='td-lbl'>
                </td>
                <td id='cell_2_11' class='td-lbl'>
                </td>
                <td id='cell_2_12' class='td-btn'>
                  <button title='ŋ,'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɲ
                  </button>
                </td>
                <td id='cell_2_13' class='td-lbl'>
                </td>
                <td id='cell_2_14' class='td-btn'>
                  <button title='N, n, ɲ,'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ŋ
                  </button>
                </td>
                <td id='cell_2_15' class='td-lbl'>
                </td>
                <td id='cell_2_16' class='td-btn'>
                  <button title='NN'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɴ
                  </button>
                </td>
                <td id='cell_2_17' class='td-lbl grey'>
                </td>
                <td id='cell_2_18' class='td-lbl grey'>
                </td>
                <td id='cell_2_19' class='td-lbl grey'>
                </td>
                <td id='cell_2_20' class='td-lbl grey'>
                </td>
              </tr>
              <tr>
                <th id='cell_3_0' class='td-lbl' colspan={ 1 }>
                    Trill
                </th>
                <td id='cell_3_1' class='td-lbl'>
                </td>
                <td id='cell_3_2' class='td-btn'>
                  <button title='BB'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʙ
                  </button>
                </td>
                <td id='cell_3_3' class='td-lbl'>
                </td>
                <td id='cell_3_4' class='td-lbl'>
                </td>
                <td id='cell_3_5' class='td-lbl'>
                </td>
                <td id='cell_3_6' class='td-lbl'>
                </td>
                <td id='cell_3_7' class='td-lbl'>
                </td>
                <td id='cell_3_8' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    r
                  </button>
                </td>
                <td id='cell_3_9' class='td-lbl'>
                </td>
                <td id='cell_3_10' class='td-lbl'>
                </td>
                <td id='cell_3_11' class='td-lbl'>
                </td>
                <td id='cell_3_12' class='td-lbl'>
                </td>
                <td id='cell_3_13' class='td-lbl grey'>
                </td>
                <td id='cell_3_14' class='td-lbl grey'>
                </td>
                <td id='cell_3_15' class='td-lbl'>
                </td>
                <td id='cell_3_16' class='td-btn'>
                  <button title='RR ʁ/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʀ
                  </button>
                </td>
                <td id='cell_3_17' class='td-lbl'>
                </td>
                <td id='cell_3_18' class='td-lbl'>
                </td>
                <td id='cell_3_19' class='td-lbl grey'>
                </td>
                <td id='cell_3_20' class='td-lbl grey'>
                </td>
              </tr>
              <tr>
                <th id='cell_4_0' class='td-lbl' colspan={ 1 }>
                    Tap/Flap
                </th>
                <td id='cell_4_1' class='td-lbl'>
                </td>
                <td id='cell_4_2' class='td-lbl'>
                </td>
                <td id='cell_4_3' class='td-lbl'>
                </td>
                <td id='cell_4_4' class='td-btn'>
                  <button title='V, v,'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ⱱ
                  </button>
                </td>
                <td id='cell_4_5' class='td-lbl'>
                </td>
                <td id='cell_4_6' class='td-lbl'>
                </td>
                <td id='cell_4_7' class='td-lbl'>
                </td>
                <td id='cell_4_8' class='td-btn'>
                  <button title='R0 RO r0 rO ɺL ɺl ɽ)'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɾ
                  </button>
                </td>
                <td id='cell_4_9' class='td-lbl'>
                </td>
                <td id='cell_4_10' class='td-lbl'>
                </td>
                <td id='cell_4_11' class='td-lbl'>
                </td>
                <td id='cell_4_12' class='td-lbl'>
                </td>
                <td id='cell_4_13' class='td-lbl grey'>
                </td>
                <td id='cell_4_14' class='td-lbl grey'>
                </td>
                <td id='cell_4_15' class='td-lbl'>
                </td>
                <td id='cell_4_16' class='td-lbl'>
                </td>
                <td id='cell_4_17' class='td-lbl'>
                </td>
                <td id='cell_4_18' class='td-lbl'>
                </td>
                <td id='cell_4_19' class='td-lbl grey'>
                </td>
                <td id='cell_4_20' class='td-lbl grey'>
                </td>
              </tr>
              <tr>
                <th id='cell_5_0' class='td-lbl' colspan={ 1 }>
                    Fricative
                </th>
                <td id='cell_5_1' class='td-btn'>
                  <button title='PH'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɸ
                  </button>
                </td>
                <td id='cell_5_2' class='td-btn'>
                  <button title='BH'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    β
                  </button>
                </td>
                <td id='cell_5_3' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    f
                  </button>
                </td>
                <td id='cell_5_4' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    v
                  </button>
                </td>
                <td id='cell_5_5' class='td-btn'>
                  <button title='TH'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    θ
                  </button>
                </td>
                <td id='cell_5_6' class='td-btn'>
                  <button title='DH'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ð
                  </button>
                </td>
                <td id='cell_5_7' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    s
                  </button>
                </td>
                <td id='cell_5_8' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    z
                  </button>
                </td>
                <td id='cell_5_9' class='td-btn'>
                  <button title='SH ɧX ɧx'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʃ
                  </button>
                </td>
                <td id='cell_5_10' class='td-btn'>
                  <button title='ZH'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʒ
                  </button>
                </td>
                <td id='cell_5_11' class='td-btn'>
                  <button title='C, c,'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ç
                  </button>
                </td>
                <td id='cell_5_12' class='td-btn'>
                  <button title='J, j,'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʝ
                  </button>
                </td>
                <td id='cell_5_13' class='td-btn'>
                  <button title='ɧʃ'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    x
                  </button>
                </td>
                <td id='cell_5_14' class='td-btn'>
                  <button title='X, x, χ,'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɣ
                  </button>
                </td>
                <td id='cell_5_15' class='td-btn'>
                  <button title='XX ɣ,'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    χ
                  </button>
                </td>
                <td id='cell_5_16' class='td-btn'>
                  <button title='ʀ/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʁ
                  </button>
                </td>
                <td id='cell_5_17' class='td-btn'>
                  <button title='-H -h H- h-'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ħ
                  </button>
                </td>
                <td id='cell_5_18' class='td-btn'>
                  <button title='-ʢ ?/ ʔ/ ʢ-'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʕ
                  </button>
                </td>
                <td id='cell_5_19' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    h
                  </button>
                </td>
                <td id='cell_5_20' class='td-btn'>
                  <button title='H, h,'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɦ
                  </button>
                </td>
              </tr>
              <tr>
                <th id='cell_6_0' class='td-lbl' colspan={ 1 }>
                    Lateral fricative
                </th>
                <td id='cell_6_1' class='td-lbl grey'>
                </td>
                <td id='cell_6_2' class='td-lbl grey'>
                </td>
                <td id='cell_6_3' class='td-lbl grey'>
                </td>
                <td id='cell_6_4' class='td-lbl grey'>
                </td>
                <td id='cell_6_5' class='td-lbl'>
                </td>
                <td id='cell_6_6' class='td-lbl'>
                </td>
                <td id='cell_6_7' class='td-btn'>
                  <button title='-L -l L- l-'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɬ
                  </button>
                </td>
                <td id='cell_6_8' class='td-btn'>
                  <button title='LZ'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɮ
                  </button>
                </td>
                <td id='cell_6_9' class='td-lbl'>
                </td>
                <td id='cell_6_10' class='td-lbl'>
                </td>
                <td id='cell_6_11' class='td-lbl'>
                </td>
                <td id='cell_6_12' class='td-lbl'>
                </td>
                <td id='cell_6_13' class='td-lbl'>
                </td>
                <td id='cell_6_14' class='td-lbl'>
                </td>
                <td id='cell_6_15' class='td-lbl'>
                </td>
                <td id='cell_6_16' class='td-lbl'>
                </td>
                <td id='cell_6_17' class='td-lbl grey'>
                </td>
                <td id='cell_6_18' class='td-lbl grey'>
                </td>
                <td id='cell_6_19' class='td-lbl grey'>
                </td>
                <td id='cell_6_20' class='td-lbl grey'>
                </td>
              </tr>
              <tr>
                <th id='cell_7_0' class='td-lbl' colspan={ 1 }>
                    Approximant
                </th>
                <td id='cell_7_1' class='td-lbl'>
                </td>
                <td id='cell_7_2' class='td-lbl'>
                </td>
                <td id='cell_7_3' class='td-lbl'>
                </td>
                <td id='cell_7_4' class='td-btn'>
                  <button title='V0 VO v0 vO'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʋ
                  </button>
                </td>
                <td id='cell_7_5' class='td-lbl'>
                </td>
                <td id='cell_7_6' class='td-lbl'>
                </td>
                <td id='cell_7_7' class='td-lbl'>
                </td>
                <td id='cell_7_8' class='td-btn'>
                  <button title='R/ r/ ɻ)'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɹ
                  </button>
                </td>
                <td id='cell_7_9' class='td-lbl'>
                </td>
                <td id='cell_7_10' class='td-lbl'>
                </td>
                <td id='cell_7_11' class='td-lbl'>
                </td>
                <td id='cell_7_12' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    j
                  </button>
                </td>
                <td id='cell_7_13' class='td-lbl'>
                </td>
                <td id='cell_7_14' class='td-btn'>
                  <button title='W, W| w, w|'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɰ
                  </button>
                </td>
                <td id='cell_7_15' class='td-lbl'>
                </td>
                <td id='cell_7_16' class='td-lbl'>
                </td>
                <td id='cell_7_17' class='td-lbl'>
                </td>
                <td id='cell_7_18' class='td-lbl'>
                </td>
                <td id='cell_7_19' class='td-lbl grey'>
                </td>
                <td id='cell_7_20' class='td-lbl grey'>
                </td>
              </tr>
              <tr>
                <th id='cell_8_0' class='td-lbl' colspan={ 1 }>
                    Lateral approximant
                </th>
                <td id='cell_8_1' class='td-lbl grey'>
                </td>
                <td id='cell_8_2' class='td-lbl grey'>
                </td>
                <td id='cell_8_3' class='td-lbl grey'>
                </td>
                <td id='cell_8_4' class='td-lbl grey'>
                </td>
                <td id='cell_8_5' class='td-lbl'>
                </td>
                <td id='cell_8_6' class='td-lbl'>
                </td>
                <td id='cell_8_7' class='td-lbl'>
                </td>
                <td id='cell_8_8' class='td-btn'>
                  <button title='ɺɾ'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    l
                  </button>
                </td>
                <td id='cell_8_9' class='td-lbl'>
                </td>
                <td id='cell_8_10' class='td-lbl'>
                </td>
                <td id='cell_8_11' class='td-lbl'>
                </td>
                <td id='cell_8_12' class='td-btn'>
                  <button title='Y/ y/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʎ
                  </button>
                </td>
                <td id='cell_8_13' class='td-lbl'>
                </td>
                <td id='cell_8_14' class='td-btn'>
                  <button title='LL'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʟ
                  </button>
                </td>
                <td id='cell_8_15' class='td-lbl'>
                </td>
                <td id='cell_8_16' class='td-lbl'>
                </td>
                <td id='cell_8_17' class='td-lbl grey'>
                </td>
                <td id='cell_8_18' class='td-lbl grey'>
                </td>
                <td id='cell_8_19' class='td-lbl grey'>
                </td>
                <td id='cell_8_20' class='td-lbl grey'>
                </td>
              </tr>
            </tbody>
          </table>

          <table className='table is-bordered'>
            <thead>
              <tr>
                <th id='cell_9_0' class='td-lbl' colspan={ 1 }>
                </th>
                <th id='cell_9_1' class='td-lbl' colspan={ 2 }>
                    Front
                </th>
                <th id='cell_9_2' class='td-lbl' colspan={ 2 }>
                    Central
                </th>
                <th id='cell_9_3' class='td-lbl' colspan={ 2 }>
                    Back
                </th>
                <th id='cell_9_4' class='td-lbl' colspan={ 1 }>
                </th>
                <th id='cell_9_5' class='td-lbl' colspan={ 2 }>
                    Non-pulmonic
                </th>
                <th id='cell_9_6' class='td-lbl' colspan={ 1 }>
                </th>
                <th id='cell_9_7' class='td-lbl' colspan={ 2 }>
                    Other
                </th>
                <th id='cell_9_8' class='td-lbl' colspan={ 1 }>
                </th>
                <th id='cell_9_9' class='td-lbl' colspan={ 7 }>
                    Diacritics
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th id='cell_10_0' class='td-lbl' colspan={ 1 }>
                    Close
                </th>
                <td id='cell_10_1' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    i
                  </button>
                </td>
                <td id='cell_10_2' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    y
                  </button>
                </td>
                <td id='cell_10_3' class='td-btn'>
                  <button title='-I -i I- i-'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɨ
                  </button>
                </td>
                <td id='cell_10_4' class='td-btn'>
                  <button title='-U -u U- u-'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʉ
                  </button>
                </td>
                <td id='cell_10_5' class='td-btn'>
                  <button title='M/ m/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɯ
                  </button>
                </td>
                <td id='cell_10_6' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    u
                  </button>
                </td>
                <td id='cell_10_7' class='td-lbl'>
                </td>
                <td id='cell_10_8' class='td-btn'>
                  <button title='O* O. o* o.'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʘ
                  </button>
                </td>
                <td id='cell_10_9' class='td-btn'>
                  <button title='|*'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ǀ
                  </button>
                </td>
                <td id='cell_10_10' class='td-lbl'>
                </td>
                <td id='cell_10_11' class='td-btn'>
                  <button title='W/ w/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʍ
                  </button>
                </td>
                <td id='cell_10_12' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    w
                  </button>
                </td>
                <td id='cell_10_13' class='td-lbl'>
                </td>
                <td id='cell_10_14' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̥
                  </button>
                </td>
                <td id='cell_10_15' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̬
                  </button>
                </td>
                <td id='cell_10_16' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̤
                  </button>
                </td>
                <td id='cell_10_17' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̰
                  </button>
                </td>
                <td id='cell_10_18' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̩
                  </button>
                </td>
                <td id='cell_10_19' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̯
                  </button>
                </td>
              </tr>
              <tr>
                <th id='cell_11_0' class='td-lbl' colspan={ 1 }>
                    Near-close
                </th>
                <td id='cell_11_1' class='td-btn'>
                  <button title='II'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɪ
                  </button>
                </td>
                <td id='cell_11_2' class='td-btn'>
                  <button title='YY'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʏ
                  </button>
                </td>
                <td id='cell_11_3' class='td-lbl'>
                </td>
                <td id='cell_11_4' class='td-lbl'>
                </td>
                <td id='cell_11_5' class='td-lbl'>
                </td>
                <td id='cell_11_6' class='td-btn'>
                  <button title='UU'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʊ
                  </button>
                </td>
                <td id='cell_11_7' class='td-lbl'>
                </td>
                <td id='cell_11_8' class='td-btn'>
                  <button title='!*'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ǃ
                  </button>
                </td>
                <td id='cell_11_9' class='td-btn'>
                  <button title='|='
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ǂ
                  </button>
                </td>
                <td id='cell_11_10' class='td-lbl'>
                </td>
                <td id='cell_11_11' class='td-btn'>
                  <button title='H/ h/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɥ
                  </button>
                </td>
                <td id='cell_11_12' class='td-btn'>
                  <button title='HH'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʜ
                  </button>
                </td>
                <td id='cell_11_13' class='td-lbl'>
                </td>
                <td id='cell_11_14' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̪
                  </button>
                </td>
                <td id='cell_11_15' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̼
                  </button>
                </td>
                <td id='cell_11_16' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̺
                  </button>
                </td>
                <td id='cell_11_17' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̻
                  </button>
                </td>
                <td id='cell_11_18' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʰ
                  </button>
                </td>
                <td id='cell_11_19' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̚
                  </button>
                </td>
              </tr>
              <tr>
                <th id='cell_12_0' class='td-lbl' colspan={ 1 }>
                    Close-mid
                </th>
                <td id='cell_12_1' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    e
                  </button>
                </td>
                <td id='cell_12_2' class='td-btn'>
                  <button title='O/ o/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ø
                  </button>
                </td>
                <td id='cell_12_3' class='td-btn'>
                  <button title='-E -e E- e-'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɘ
                  </button>
                </td>
                <td id='cell_12_4' class='td-btn'>
                  <button title='-O -o O- o-'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɵ
                  </button>
                </td>
                <td id='cell_12_5' class='td-btn'>
                  <button title='OX XO'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɤ
                  </button>
                </td>
                <td id='cell_12_6' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    o
                  </button>
                </td>
                <td id='cell_12_7' class='td-lbl'>
                </td>
                <td id='cell_12_8' class='td-btn'>
                  <button title='=*'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ǁ
                  </button>
                </td>
                <td id='cell_12_9' class='td-btn'>
                  <button title='!/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ¡
                  </button>
                </td>
                <td id='cell_12_10' class='td-lbl'>
                </td>
                <td id='cell_12_11' class='td-btn'>
                  <button title='-ʕ ʕ-'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʢ
                  </button>
                </td>
                <td id='cell_12_12' class='td-btn'>
                  <button title='-? -ʔ ?- ʔ-'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʡ
                  </button>
                </td>
                <td id='cell_12_13' class='td-lbl'>
                </td>
                <td id='cell_12_14' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̟
                  </button>
                </td>
                <td id='cell_12_15' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̠
                  </button>
                </td>
                <td id='cell_12_16' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̈
                  </button>
                </td>
                <td id='cell_12_17' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̽
                  </button>
                </td>
                <td id='cell_12_18' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̝
                  </button>
                </td>
                <td id='cell_12_19' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̞
                  </button>
                </td>
              </tr>
              <tr>
                <th id='cell_13_0' class='td-lbl' colspan={ 1 }>
                    Mid
                </th>
                <td id='cell_13_1' class='td-lbl'>
                </td>
                <td id='cell_13_2' class='td-lbl'>
                </td>
                <td id='cell_13_3' class='td-btn'>
                  <button title='E/ e/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ə
                  </button>
                </td>
                <td id='cell_13_4' class='td-lbl'>
                </td>
                <td id='cell_13_5' class='td-lbl'>
                </td>
                <td id='cell_13_6' class='td-lbl'>
                </td>
                <td id='cell_13_7' class='td-lbl'>
                </td>
                <td id='cell_13_8' class='td-btn'>
                  <button title='K/ k/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʞ
                  </button>
                </td>
                <td id='cell_13_9' class='td-btn'>
                  <button title='&quot)'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʼ
                  </button>
                </td>
                <td id='cell_13_10' class='td-lbl'>
                </td>
                <td id='cell_13_11' class='td-btn'>
                  <button title='SJ'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɕ
                  </button>
                </td>
                <td id='cell_13_12' class='td-btn'>
                  <button title='ZJ'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʑ
                  </button>
                </td>
                <td id='cell_13_13' class='td-lbl'>
                </td>
                <td id='cell_13_14' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʷ
                  </button>
                </td>
                <td id='cell_13_15' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʲ
                  </button>
                </td>
                <td id='cell_13_16' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ᶣ
                  </button>
                </td>
                <td id='cell_13_17' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ᶹ
                  </button>
                </td>
                <td id='cell_13_18' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ˠ
                  </button>
                </td>
                <td id='cell_13_19' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ˤ
                  </button>
                </td>
                <td id='cell_13_20' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̴
                  </button>
                </td>
              </tr>
              <tr>
                <th id='cell_14_0' class='td-lbl' colspan={ 1 }>
                    Open-mid
                </th>
                <td id='cell_14_1' class='td-btn'>
                  <button title='EE ɜ/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɛ
                  </button>
                </td>
                <td id='cell_14_2' class='td-btn'>
                  <button title='OE'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    œ
                  </button>
                </td>
                <td id='cell_14_3' class='td-btn'>
                  <button title='ɛ/ ɞ('
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɜ
                  </button>
                </td>
                <td id='cell_14_4' class='td-btn'>
                  <button title='EB OO ɜ('
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɞ
                  </button>
                </td>
                <td id='cell_14_5' class='td-btn'>
                  <button title='/\ V/ v/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʌ
                  </button>
                </td>
                <td id='cell_14_6' class='td-btn'>
                  <button title='C/ c/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɔ
                  </button>
                </td>
                <td id='cell_14_7' class='td-lbl'>
                </td>
                <td id='cell_14_8' class='td-btn'>
                  <button title='B( b('
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɓ
                  </button>
                </td>
                <td id='cell_14_9' class='td-btn'>
                  <button title='D( d( ᶑ)'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɗ
                  </button>
                </td>
                <td id='cell_14_10' class='td-lbl'>
                </td>
                <td id='cell_14_11' class='td-btn'>
                  <button title='LR Lɾ RL lɾ ɾL ɾl'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɺ
                  </button>
                </td>
                <td id='cell_14_12' class='td-btn'>
                  <button title='Xʃ xʃ ʃX ʃx'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɧ
                  </button>
                </td>
                <td id='cell_14_13' class='td-lbl'>
                </td>
                <td id='cell_14_14' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̹
                  </button>
                </td>
                <td id='cell_14_15' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̜
                  </button>
                </td>
                <td id='cell_14_16' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̘
                  </button>
                </td>
                <td id='cell_14_17' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̙
                  </button>
                </td>
                <td id='cell_14_18' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̃
                  </button>
                </td>
                <td id='cell_14_19' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ˞
                  </button>
                </td>
              </tr>
              <tr>
                <th id='cell_15_0' class='td-lbl' colspan={ 1 }>
                    Near-open
                </th>
                <td id='cell_15_1' class='td-btn'>
                  <button title='AE'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    æ
                  </button>
                </td>
                <td id='cell_15_2' class='td-lbl'>
                </td>
                <td id='cell_15_3' class='td-btn'>
                  <button title='A/ a/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɐ
                  </button>
                </td>
                <td id='cell_15_4' class='td-lbl'>
                </td>
                <td id='cell_15_5' class='td-lbl'>
                </td>
                <td id='cell_15_6' class='td-lbl'>
                </td>
                <td id='cell_15_7' class='td-lbl'>
                </td>
                <td id='cell_15_8' class='td-btn'>
                  <button title='ɖ( ɗ)'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ᶑ
                  </button>
                </td>
                <td id='cell_15_9' class='td-btn'>
                  <button title='J( j( ɟ('
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʄ
                  </button>
                </td>
                <td id='cell_15_10' class='td-lbl'>
                </td>
                <td id='cell_15_11' class='td-lbl'>
                </td>
                <td id='cell_15_12' class='td-lbl'>
                </td>
                <td id='cell_15_13' class='td-lbl'>
                </td>
              </tr>
              <tr>
                <th id='cell_16_0' class='td-lbl' colspan={ 1 }>
                    Open
                </th>
                <td id='cell_16_1' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    a
                  </button>
                </td>
                <td id='cell_16_2' class='td-btn'>
                  <button title='CE'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɶ
                  </button>
                </td>
                <td id='cell_16_3' class='td-lbl'>
                </td>
                <td id='cell_16_4' class='td-lbl'>
                </td>
                <td id='cell_16_5' class='td-btn'>
                  <button title='AA A| O| a| o| ɒ/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɑ
                  </button>
                </td>
                <td id='cell_16_6' class='td-btn'>
                  <button title='|A |O |a |o ɑ/'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɒ
                  </button>
                </td>
                <td id='cell_16_7' class='td-lbl'>
                </td>
                <td id='cell_16_8' class='td-btn'>
                  <button title='G( g('
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ɠ
                  </button>
                </td>
                <td id='cell_16_9' class='td-btn'>
                  <button title='ɢ('
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ʛ
                  </button>
                </td>
                <td id='cell_16_10' class='td-lbl'>
                </td>
                <th id='cell_16_11' class='td-lbl' colspan={ 2 }>
                    Suprasegmental
                </th>
                <td id='cell_16_12' class='td-btn'>
                  <button title='&quot&quot'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ˈ
                  </button>
                </td>
                <td id='cell_16_13' class='td-btn'>
                  <button title=',,'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ˌ
                  </button>
                </td>
                <td id='cell_16_14' class='td-btn'>
                  <button title='-ˑ :: ˑ-'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ː
                  </button>
                </td>
                <td id='cell_16_15' class='td-btn'>
                  <button title='-ː ː-'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ˑ
                  </button>
                </td>
                <td id='cell_16_16' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ̆
                  </button>
                </td>
                <td id='cell_16_17' class='td-btn'>
                  <button title=''
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    |
                  </button>
                </td>
                <td id='cell_16_18' class='td-btn'>
                  <button title='||'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ‖
                  </button>
                </td>
                <td id='cell_16_19' class='td-btn'>
                  <button title='͜)'
                    onClick={ (event) => updateInput(event.currentTarget.innerHTML) }>
                    ‿
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

        </section>

      </div>
    </div>
  )
}