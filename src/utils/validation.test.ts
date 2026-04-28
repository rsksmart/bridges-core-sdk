import { describe, test, expect, it } from '@jest/globals'
import { type Network } from '../config'
import { assertTruthy, isBtcAddress, isBtcMainnetAddress, isBtcNativeSegwitAddress, isBtcTestnetAddress, isLegacyBtcAddress, isRskAddress, isRskChecksummedAddress, isSecureUrl, isTaprootAddress, isValidSignature, rskChecksum, validateRequiredFields, isBtcZeroAddress, BTC_ZERO_ADDRESS_TESTNET, BTC_ZERO_ADDRESS_MAINNET } from './validation'
import { ethers } from 'ethers'

const testnetLegacyAddresses: string[] = [
  'mi3KGJwXHCCKddxnACouP5EwYq525qcQhU',
  'mhk5p8jVtT9Cb9ah5GyCfF7eXeaRKzinSp',
  'mppUmH1Hvdm3whPb41HiL3TezFtbUqRLyj',
  'n3K2HgoEqXiZsFZi8TepEsoWsWdCfqWcB7',
  'n1AcGZntYKazvvk3TQkTcK8L5kwhDhWGd7',
  'mqRAMhXvrLWF99xVkGWbsmrrrfF3uqshgc',
  'msEg49LL1XbP7ry6KdKHPf1QKFZ1jfFpcE',
  'mxWaWiieqAsBKg5MpVpBe2Gp4Ru3xq5Jin',
  'mh1LxGvH9Lmsf8KWkBrpy7Pxi5qRGwSBwk',
  'mkNYXQ2RFgQ9jM9HVxGqor3u5XpYpu5gX3',
  'mrgNF61xQquzkRaiQxWGeqRGFHPKdnCkXH',
  'myTbwP4KN4pypddFFrBGMz6SA9ArYN4M9U',
  'n3Z39sN3zTAkBk1wRKXRpqspwQzDwjDf8u',
  'n4iww5n125mWoDvf22j2mvDALovM9uSpFY',
  'mhV7kz5JukajDz4BEdpKABLCFHZxHPj19v',
  'mzYW5dFAittvuxx1iEqt9vapHibePXgknw',
  'mkjzJ2ngEeqqKtCfex29beuUpegqJTWXgB',
  'mpo6ceytLsBMzDTQfnLCg9aEbnAqGbqz4u',
  'mpRXJiToLH7Hv31eTX6BYJVeMVFmWFre8E',
  'mmWysmXoNe2U5Y1g2X4y72dnMProEz1yJW',
  'mmX2hUbv4NuRd5JqdsUvhbC7fqbDM78VQi',
  'mtv1ga3Tt43zBQQd3YPAArFkC61ehJovWr',
  'muoGopyYrZsJmv2tmnGXemoEpZ3wXAgvKc',
  'n442h6K8bwyxwpFvgs5d44CEiMiKtaKeFH',
  'mvJvYAhAawvVC9upsZ57BegVMLAq4N25oR',
  '2N4VTCqoeAVApqktfRQMzZFfjGn68cgyjBr',
  '2MtYRwBnPZ8HAqFvseTB8FF83cSCLDQjvpT',
  '2NERCN1Tf2h3bAn8jZNTw6HRyhHMcpzFtiZ',
  '2MtFonPiFb1YvbCFCzchcKGZH9u4zyx9FiH',
  '2MwZNquBbXwAr6tn3Dx4JgPN4YXC3aZp1rq',
  '2Muzj5Xk5SVARnFKpEwWnoZio8BAhguPDGN',
  '2N3XcfjP26wHMBnt8esQnrc81Zoxf8SgRyz',
  '2N6of5ZCDeahQ7kyWAGR1PR8QyhPZTrzuhm',
  '2MvV4A2xKYshE1kkgSoXmtsH8DvDVMsaS9i',
  '2MxAjj62gb98vFSWn5BCvN9TqRfqqvBfc29',
  '2NG2hAfvkh5Wapc1SqsajzKmb7t1towVYMo',
  '2N8Z8m9oBY49WvJYoV7qqMrC642T3NbTzFw',
  '2N12RChLARJdsWHrnvSMpZR3oAsaETto3JG',
  '2NFmX5iayrxqkqWSaCC2p9e9ZxXVTrC5UTf',
  '2MtXJ166JCZL2ZJJr9QiZdZzDeqiw6v7fka',
  '2NFNmeUcNSZSMJ6mks19Zy3cnHgrpUXuBVF',
  '2NBFmcYcqXbhwacEFTYqsvurLYtaqzJgA7f',
  '2N4NkwYehTNMv5r4FVJKdDbmeNxmnENEYJg',
  '2My914zT7yfFQDMhe5KnWXMMaSmXURSWk7N',
  '2MvnL3WuMYGAyom15sAZMEenMFEdSiev8uj',
  '2MzJzVprxYgKd7vhMBnAHdpsUv87evvDJ7x',
  '2NENuGG55kdbeMumguyVfwR4Ju63KqnMQHQ',
  '2N35Vk6PAYpbgY3Q6NSSfcqYg5FyEUYfX7y',
  '2MyGaCkLHVpKyoLzkBowpzzUeEZgTMM5b5X',
  '2Mxc1y78aR8i5o8jJhtSMMp5uxD38ue2wNb'
]
const mainnetLegacyAddresses: string[] = [
  '1EdKLcM9JPoXNs2RutHiBTRvkHPmQfFwWw',
  '14RNV7t3UwbyXokk5quL2ayJjVqGRMC1rP',
  '1FstuggbXyBiU83xe33WJJwbsZBi4NMNy',
  '16hV9PNaGYNQW5RTFkyS3Gu1dxv73zdLSP',
  '1DgsfhHuZDLcK7vMRfVq9EuxVtfaSRhDN',
  '1LGN4aB5Mh8ZwtiahVChem2ktX6oWfyp9N',
  '14hdqTDa9cXuTksUijs1szGQLr4aUxCBwR',
  '1LodWHoMgKJ98ManW7mNyzWkotqPReeAf7',
  '1P7d1RrMALGYcTGi9xnGirtsueGfWdvR98',
  '1Ua4ogEqkDHAEqyJiaNjH3daxVRa5upY6',
  '1Emb4XEitA5ERj3nxEmvKggBndNK92ueTU',
  '14qSurWwxnC85jMsyVDcZgiwi8WEsdZiVe',
  '1NtwqUAmfx7mhaFoTcqYHE4RWE8VgpmxkY',
  '1FAnmbPJJNgeJADYrqdnLuuhYTntsXUz2V',
  '1HKfPnF7MbrVYAZD5vQ2erTkp5gCj3ohmF',
  '14eJ3ciiZ5WHuW4WaTcxBv31BNUKUEiV8C',
  '1MENjHKt9yWi3iCYFpL2Hp1jVRfuX7EB6N',
  '1cf89GJQEYzf24j8mTQWaPFU9JqnT6iwb',
  '1NcwPh6onYyaQAn4ZDVxvQsdwPLT6c7bnx',
  '174CTurocL1UjRzuzJ9h3jLSoneiWuPRRH',
  '1t73QkRSk4ZCT7qY6dvmKhiKn6yZUs27S',
  '1JoUPS1LcrxUQz4mY45kFyQCLrjhGHTWT2',
  '1C26mexb9qgp5cpUK2sYJtpf9bxKhb9NVG',
  '1BrG4SJrErBuExTwrXgzsESeZbDZnh46mr',
  '12gPbxpJZg5oVXV9qaDgmXZDfVuPvoFVdw',
  '3HwGVBDv7jPuS8ncTFm36UW69h36BsdjqL',
  '384B1WkNYMm58o6F7w1yVEZwX48EvFKbSa',
  '3PUWoEeffv7y1WeYEF9v2gA9AxQ9v1FVLn',
  '3KXu18nZ5qE9mwap3sKi35Du9rdSn8hHuP',
  '3MnspZrXnAvYhCrGLYNvRreHiHsz587Z5q',
  '35Vebz7gEQk8pEpi5FyZy4fTGngBificfL',
  '39NNxXAg35E256YeU3ofnPXzkq3aAoMJdx',
  '3Pu2Jp63S5WfFTE3bZM9kPPUFAqQvXCEBZ',
  '3QD7radHE3LUjWQGtpXvCiZJeGmPPLfy55',
  '36xT5Ly3hyPATenoFvXn9vD21gLFecjSpc',
  '3End97i9TYEkSFBEpAP6mKMYHDJHcKAJ2S',
  '3JRL2REh3KGJaKLNuPXCz4K2ZSCVbzhBKh',
  '37ofEuKT4cZhc1iZY5k1uRx1ShoRwtXmXi',
  '3DEAo1q2dABPzoxvcqsEXYSzDBvBHpyPkp',
  '3QmBRzpsUDxUjt7TzNGRcHHgZRn3gxszyb',
  '31tvn8gdKgg525KNZM4wevi87GafSzD1FU',
  '33BTakydSPnJfSfR13foniEsPCB2nuHiCb',
  '3Fi3ywSD7eBEtnoUuiW7zFSBmpATd3YDLs',
  '3DCT2YtzwZZYdr3pPEhqVjA1Amak89YrHf',
  '3EuQdJ651cN7Cv9jJk2EJPdRhKT9JJFpt8',
  '3BcLTSd24JRtJhLcKqkeF83rFmFxxY5qH9',
  '35ficBSmjzqdSqAWCKgZCeeTG5q5mB5EFj',
  '3A2YVYwmodEATGGKSjJ9vx7jY5YLkq9kst',
  '34JdvFMpFfBSk6ibR1HAzjTVaZ8Dbt1YuL',
  '33tB53JpXTNeDvMUeXKLU3VfYMLMc6oLab'
]

const nativeSegwitTestnetAddresses: string[] = [
  'tb1q2hxr4x5g4grwwrerf3y4tge776hmuw0wnh5vrd',
  'tb1qj9g0zjrj5r872hkkvxcedr3l504z50ayy5ercl',
  'tb1qpkv0lra0nz68ge5lzjjt6urdz2ejx8x4e9ell3',
  'tb1qqgzlw8yhyj6tmutat0u5n3dnxm3y6xnjp53wy9',
  'tb1qcc4j0tdu3lwfl05her3crlnvtqvltt90n5s5m0',
  'tb1q7k3nex0gssyucqvz7xpk25wzqfpc56ve9myzqs',
  'tb1qur2ztvmx4tqdxa35js04zuqhwx624z3nyuv97l',
  'tb1q3n9lhc63xwkfrj25sy2gqf06r77vzqcryxqe7k',
  'tb1qc706vv5vyqqz3drx080c3um3t2ylze8fuxuujd',
  'tb1qj36sglrgm590mdkht0dququug73azfxcxdnhk7',
  'tb1qu05qzyrlqaeth5j0p0fkxek4tp5huffveryewa',
  'tb1qv87afr2gu8g57v7u39g6h8txwx7afvkzc5ja0j',
  'tb1qc85tj3uc7auyndw4en02vk74ty2720rpppaxd5',
  'tb1q94u4lqykk9m387p59sqcvks7dhjpaz8tf5kdkp',
  'tb1qclumyllxep6gp9rnv7wzks869t7w5ct9rznuzd',
  'tb1qv55ksu4ll2xmekru50nknac6zkq9c87mf387n2',
  'tb1qw853dsyg9745dm5q39zmgnk3m6ldr879q5rht6',
  'tb1qtzx5vjl37rl8nefn4ppdqvwrxw9cvrqf2w632d',
  'tb1qxylu8c2r9ypucc7jas47n3dy400kx0n4hd5g2t',
  'tb1qmznvxadpzmzc5x3q9cvwsu0vrud967hnryndq0',
  'tb1q700p8wdp9t6z3f59f009uwqkf8nct49arn9zh4',
  'tb1q0dgpnxve9utzc3m38zmw7drh0ekdw20gup6sqp',
  'tb1q36tpm7eu706v0ut0hap6yjuehgsg53rg280tc9',
  'tb1qwnmmmrrr7hw60yulw2rx50ne2tkktj729076zf',
  'tb1qag9uv7n266eyf6d88xc3e5nmek8sqe6aqxmfpp',
  'tb1qvs9dh8nfl8g2w4sadtpx348ydklppgh7w4kjagqhvy4zmn90c0jsdwqjft',
  'tb1q7hmvr9m0kel7gcld6jqnw3s2flhn46j47s08emagzu9q2ezhvc6stxn05s',
  'tb1qp2gtrvf378c3s6udckwdtfya3542xkxjerrndmlp3nq5v9tq2unqz9chqm',
  'tb1q66czzvq35nqlj7ze5mksk6lqucts3p8ngcfm3ufp2u8j7tg0z8vs68xwlt',
  'tb1qjnk96l3r5kx83mv8uthgrjjzehezx4ltzz9ys92hzca8ya7rhh4quh576w',
  'tb1qa692rapk5jr00mnk8wuyg3xr0w6j5xfl4v5qyvs8jlsdcrtwh7psultt9w',
  'tb1qf2qst4nhhh98f972j735jvhfly2eq0rqx4a79q6d6q6t5txusd2qt04579',
  'tb1qgpusykny8faum9egnzl5cczuswrrcsnhf8h7kjvp5skjftxxj5mq65jamm',
  'tb1q2h0w3edf0x93ftq2a0ytu32d77ey5gwt576997mfndhxjghddj6q0a642z',
  'tb1qr2jkf56cat4e4vsfyz8g0rlxwg6vfad3ysllat9fymvdc8zdup0qp93nk9',
  'tb1qwkakyhlkk07v4vkp548ymaqqfke59kmq3nlyum9pl4jr8ncum76qm28yy9',
  'tb1qmnm9s038eep6xgsplxt39n4mum3a5ajw2pcfwmnn8v47n7hme5aqu3xyxm',
  'tb1qxny4vvtkcxy3pf0tr0ckartpqfs9ws543jdqfvrz4724tl57s5rq2hl9ya',
  'tb1q2ynwu9spshhj9h3cawq4lc4vd7jcpyuc6zqd38cme2gtyqmf8res8s5zwl',
  'tb1qhel6948dutqnuhu780sqc40vfq88ml6t75wjf394n8sj7r9kmm3ss3thcr',
  'tb1qcth09mdv80aa5fj06rej0u3dwf55ppllra76zt37l2ky4t7krk5s959r36',
  'tb1qmnj2m926plxtnxmxmzjvat4wsdwujt8rcu8pqqjyurykc9hx9rcq7l3qq3',
  'tb1qjq66y9a8nxzh9hj8nhrh58dy6wplv5ljsky2qzpwnn8nd659l24qswpn9k',
  'tb1qyefymrktzrxnjw6l0wwzjkavrdurs7a2kgls3068fygt46nee0pqdsrxr3',
  'tb1q3n2l2rcwlrvrl94n8wqa6qpy03j85s5qvkeywe9kejdnn64xqu8stgue7l',
  'tb1qvwvu8rryy5ntkhzlrpekensvv723f5k3dat8u8sqtpu57kd5n8rsc3x88y',
  'tb1qcddju8vymuvcxf3c4ns2er7dkhm6zaznwp4gscg0uxj0p3r2dspspuwthk',
  'tb1qreruyjjksdltfvalxdards6evjcjqfsk2w5ayrl7nl4axulu7t3qnmy2yg',
  'tb1qzzcuk79q4wzr87u4rfjswr46rs76jxy6sd6neca7vm0y05sml5pslshzl6',
  'tb1qhdyga8g2huv5wevlgpqa5xfz2tzpg7swg6vmaxjfeljezsrr890q4ndkyt'
]

const nativeSegwitMainnetAddresses: string[] = [
  'bc1qg5d579rlqmfekwx3m85a2sr8gy2s5dwfjj2lun',
  'bc1qtqxd29s9k3tj3rq9fzj7mnjknvlqzy8hsuzs5x',
  'bc1qv245zr29zw5urv5fy00c6km09l302fmlftf0aj',
  'bc1qw4z64jjvuxyddjdcm88yt0ln7fntkyw0w6wqhp',
  'bc1q8d7e3jrhsf8tj9q28x3msf8c644hdaetpqy7t4',
  'bc1qzs5h0w6zjk3gej89gz3fjqx3xv9kvngntam76g',
  'bc1qtj7y3xapmn38gra6jd3x6ua905j72plz5rv0kq',
  'bc1qx2xgfynw4fjtm8c2glv9ceue5j0k42fdp6u8vz',
  'bc1qtjrcft537z0kwcl7efucqh3f6xyvkqc908g9ve',
  'bc1q4a2le8yt6l6x0t9cfxmmx35runhf58lktvq8wn',
  'bc1q5qxpf5ca4s9k420h6vx9gegdqtq77sxdmqxca6',
  'bc1q9wjmgcfny0rsyhd727y6t3xv8wf69ggmk04msw',
  'bc1qufr3cd7kmr9kufd62wh3d0jq44zqrm4yqjyc04',
  'bc1q455afukjmkm0v9fpldqacc8jdevfvcylxtz97y',
  'bc1qyg6m5eyjlder7cg8ja5lw788jn9pfsx4ypyr9t',
  'bc1q9qfptdws3l0qqrhc8fvfezw3uv3f0vtrzz4m57',
  'bc1q7uq8kxtnu6ya8l3k7c4w7avxwweqa8c2nfv7zh',
  'bc1quk39lyk9tya3z34g7zarfnxegv855584pmy9ud',
  'bc1qfy323zdtp7dd6pjxkz5k46l7v6kktmsp2vrsfd',
  'bc1qkmm0yj2heftt0safn7cgqrexdzhujz53kfpq6w',
  'bc1qwr5glcl76g7hwnx8kunqsxuapm6vq3mg8yel50',
  'bc1q8eg9j6khqeqhrjsmc5890nnpjyaj3wdkkq6485',
  'bc1q2rrlg43vv5snstv3mvc79mfr9amfw4yknhjtew',
  'bc1q9da5fx8eerg4m40vkqc2mm24nykxhtpw9sfcw3',
  'bc1qma0pelvcshhq59wfur9p5rhacjyk0lmfdr53vs',
  'bc1qj6dkdx6u65cjzm67066gnktwhntqsfcxffzw8msz22533uaxkf7q9lwt8q',
  'bc1qxejudnx6u2r82wcad2l87qmme3qcqp5z9k6zn8vmg995qxfr4w4sf7r5mc',
  'bc1q4lnz7k2vxmds6t8r4rmdpl64v79fjkhkvncd7r35k6lmaqw9mgxq80s7x9',
  'bc1qh80vmjav8nwqwh2a0f36lje2xz3k8afkdusvcvq27lwnq0s52t6q0l046c',
  'bc1q0qtqwydq9rf3ta52m6m5rdajssjce986wnah5lvv84ymmfuzy5kqzjnn03',
  'bc1qu72f62gkqd2a5nmdr427spt7lktjwjh4z8mklnlcyfdc7z0eq9dsd2w8n0',
  'bc1qps3rsr7yh0qp8avymlkqqkxvffpy3s5sldyjt9althyav39u8tusvpf97t',
  'bc1qe0urqpvt6jaac394792u4w9zug48ycma3m5z7ekqvankv4gujzksd6q5ac',
  'bc1qj8m6dgcgp5s60de0zl69rk26skr8t39uwqtwtm8y2njx6v6ck29qvlpn55',
  'bc1qrzdg5snm2725zwvc5u3x7f8l38n2v8y7llp8taz2szqz8rd5fd4qchgcwk',
  'bc1qmx09kvfung69z32pxjp6lj3ywtmnulqrfuu2nnzne4h99xkgewgsc9cfkv',
  'bc1q4nsq7r93gk3xpgecldzuq22ecnrt6vaap5yewav2rc3shulkaugqsef5hj',
  'bc1q8w9g7czn5padwr6xzz5y9c99xayqftt49mvr0ulpnq3ledgvxzzqqelv22',
  'bc1qkegrvnjpnmr7m0fa7wus6j64erk2nhna0pdlwqqg7r77gd3x8dtsg3avmf',
  'bc1qd9seqlkyvpkf842lxxwxcfggxjuxew9lptm7gnkv99eqraja8yvqytq3wl',
  'bc1qkgdjy8zg2yuvnmanxj0dn732sxdg7p30jjwmzmv9wk30t66xz46qad3d36',
  'bc1q7atft6f8gjfkt55n66u3pplqlq5f56emw0r2ajmrfrec6yqtg0ks24fnc9',
  'bc1q6avw5ndtc56xe9q9tw70dgwpkny98l8mez484qykt973d9h588ksy7tl3x',
  'bc1qctsqyq64h4fhsnhpymluzyzqu0kcr9ts8s68xsqm8r0awa23gk2sd7vv5t',
  'bc1q8023e3zn3p6l5nzshnj99wc2n2ltar20tvngv49ea2dn76seuknslq4pcq',
  'bc1qxnuwh2wdjgw8497zfj3jlhg25ck3mgh39aqnhwlepdf93vcxk3dqudqar5',
  'bc1qxun4jx787x78ejcpmxrtepk50f4e84s0wyrr935ydqdhg54xtd2s5v6ulv',
  'bc1qaf2snwc2fplzc64wz738r5t55qg8636jwl7kwwa3x7ypvujhxegqnc6p0p',
  'bc1qp3tweypfpgw9646ym9fd7vntd20jdyv2tk942e0dm0duegprawhqj0d52d',
  'bc1q6d9czdkujad8svs3xtlnnnlp8z97gr6lqce28l0u7w2m0uzq4m8qc8l3hv'
]

const regtestNativeSegwitAddresses: string[] = [
  'bcrt1qf706ctquwrdnwr9gke0k96akquv6v82mr0lk4y',
  'bcrt1qs4dc0t0dg6r0l326ujhl0v2r2jvsjv3mc45f86',
  'bcrt1qg4vyjktaatpqekwckn87yzsrs4g4zd6zlwc86z',
  'bcrt1qnlxn07elqmajq8tzgh5rdfpnl2eef6957qrfhp',
  'bcrt1ql0d92889afvq3zasxjhdka7dqx7vg2y5eh0q9v',
  'bcrt1q6nxr8v5gwj4k07v4dge224606l2hx7zcl6j7zm',
  'bcrt1qvwf4n4v56nfpcspx95dgmj4p0jrrf2zj4zctpq',
  'bcrt1q35pzep6uxf3v2z738l9v86sy08fws67xjd36nz',
  'bcrt1qzk9ndwd60y7xjjtsgkey46knfp7wvvcptq29vr',
  'bcrt1qydjxkygfs9u6a3dlz4uc3xcm02uhdl2tcn8vvf',
  'bcrt1qwm7at7m3tdeaqtsyp2jmwvd7nrrs8ty4xgt59r',
  'bcrt1q7y02faj6qugvd4rgq8mdlhkhna8xzgdzac7ylj',
  'bcrt1q9z6enscclx6ry0yxumrsh8uxakskwej05e4l9k',
  'bcrt1qxs3xc8u5zzq3urcahrgckpj5ejjknrcv3037t4',
  'bcrt1qqcymjd300lp4vtllwm5stradf84972upxq6xed',
  'bcrt1q6gwcst038euu68f6afzclemsuchnxkj5rcgph2',
  'bcrt1qh0k9qft4j5nah586vuzjpgdjfshgjetheaj500',
  'bcrt1qrwxh7nvcuvjft2mrkea3cef8tghvwzy5w7uzpu',
  'bcrt1q58nkth0m2nmppaqx04z5y7mzfe5zu5q77kkk2g',
  'bcrt1qeeej8tsnlwx3a9vqcrvp9wpeparllgqserq5hl',
  'bcrt1qzjt2yg2taaue9lcpzfv60gjdrdfqxqn9m7wy60',
  'bcrt1q8yy3s6g807aprhe290v3rdt3p65rztanyrgxa2',
  'bcrt1q7e6p4ugd8ll5ucc7e7v9z4zafsyernvfrpk7p2',
  'bcrt1qexjvn85l7c7rlgsjuqfj5gy6rzadpxqg97sq8w',
  'bcrt1qv57l86qqqvk43qwznqpuktt60078ckzv37x79m',
  'bcrt1q4mjl38t359838ca0mvfqeplxtjl9828xsa95zk0pkeghpzwdmffsce55rp',
  'bcrt1qeyu5t3he942gdn3zngn6l8rk8nufqn3s4fcd24gw5kezg2swcv6qd5pgdc',
  'bcrt1qn8r8d8cvc2prqzkkjvx6q54ceqjxqxe6ra5yppwzdmls4g7scqysjlrdld',
  'bcrt1q9lme327atp80mejah83kgpflqdqsev4yselsg7lfvcmy48lpllysr900gj',
  'bcrt1qputlgttfcpr47t47hxtu5m659dczklk2hjwjrz5f8amnu3pvwgdqt6dcll',
  'bcrt1qmy96tcm0dt68ngnuk4qmu8clqctt7qvdr5mgqkwmvxj6fz0sx8gq7yps55',
  'bcrt1qsw7y2dx5lps3aklk0apkaq2nn7z8mwe33mcukjlvkxr0m82capfsxnn54e',
  'bcrt1qrg58t7ahs3p4ppp44n0mz7rqd965gkq80amfxq8ugfty5rx8x05sme4wat',
  'bcrt1qzn9eddrtzr9xd34244f6fsxh3qu6zf3p8fxy46qju2zcmdcf4ytqfenwx3',
  'bcrt1qqkpeklpqzcelwfeap5cmwwql0aw7prcyw4r9elsp5yfkwth3s06qlcqhfm',
  'bcrt1qgk47rl2az48kt9dnfg7na0ndh5747fu74n9trzykl9nl4qu8r70sccapdy',
  'bcrt1qsywxkpz06w2tf52p9clx45a743rvqn237szc5hk206cfjasgt5usvs42pk',
  'bcrt1qqtled6x7stjc4e4a2u5j2gmen2pkkwpvvuvy8rskyuuyj36t8mgs5h4rq6',
  'bcrt1qrnh73y2ep9n4jpvqpky63kstdvqr4966tg2zmgqp7xk5kcdyw4gquxh626',
  'bcrt1q944utjaa22z8qwrtyvf8frvj83689we0tvyezpm0nn2qkgsyvxvsm0n66m',
  'bcrt1q0kglff3zuypaf92yxlyxyfgemd0tu5uxz45x66jhf6avnafqaufq2ykw6x',
  'bcrt1q63xwadynraryfcykx0kyr85y4yyc5m9nnq4cz55nswe67cuc5v8qr89ky3',
  'bcrt1qud9c9ely5lyhel8eay52qa0ld7f5yw6ae5xsplxc7ndavufd20kqn5kt6w',
  'bcrt1q5wlvwxdr2nu7pg37up0wrcedqluqpyhuq7v3pzrswwsmmqfln23qvzscs2',
  'bcrt1q533c7qy5l356683w4qajcfvzlfalxtvmjlemkkvutekwqmayz5asvlq0ks',
  'bcrt1q24t8hn485jqh8tk4x9fa0lym46ha7kl0clsepedznmrh4t320nuqcpkjft',
  'bcrt1qt82upshnjfj02ssdrftu2yeztlqygrurmrlgmwk6cd8xpjhzwr9q83gx64',
  'bcrt1qhcqutvf0maatea8fyz5zwj92p0dzw9rtrnwzmqt4fkm3k0xtfy6q7zywmw',
  'bcrt1qetpxqqq8jmhjg5xe5y202cp0w9et5vxqxl2tzf8jz8r45eujd2lsahmxf0',
  'bcrt1qt5njkcfh5fmmyn8la5e99uu7fp2qu3sc4sg3x9vhdrhaz3havtqs4m5kmh'
]

const mainnetTaprootAddresses: string[] = [
  'bc1pjqxvw84hrw2wzv5f0z63w5c0t5ulx6wxgld6gad3v7wjnactnmns0asm5p',
  'bc1pkmdww7kwjtqs75dkdzn9kw0htuauqmcaq8pzv3as5uaxxted3rrq8krr6c',
  'bc1pg0p6tqp32zw56c2d9ldv2dpktzd9nmf7jrcy8ethmrnec48t9eusu4fdlz',
  'bc1pgmr8x6h0mk9qeftj8k2lc0f8ca9err835nuwcrjw5lk8kr2kup6srmmpex',
  'bc1p5wn932xhatdlqcf9eeql5hqw5wz3xgsfqp0q46a2lqkcv3pd8xysdqdn8k',
  'bc1pvcf9vmedcqewl3dsn32zku8tm7px8a3un0dm7jejuy36xr5ya9eqxxpsk7',
  'bc1ptlhwe427vxr8mq4ehu83psfwrfnew7glz9ym8qxd3nlm8nghqszs47sfc4',
  'bc1pjperm6ss84nx884urk8q0mf06z79gsgc8rme0pnc930pww6jvxnqwaktk9',
  'bc1pp7g2mk4nuzm6qwymuqpjx3lqzymg8vnvpd49mnne05jh7lkeherqhhtekm',
  'bc1pq30k275nnggzr26axxyr9eushd8mpuz9hulkdfvrft6qws9f5wqq8g8s5e',
  'bc1pe07wa4xjhctxdqzz2tjphyf2t4eq6x9dq9f2hs2ej5eegzpslwss8f4q7t',
  'bc1pzdgxt86uxm024uerdcj6mm06nnuvkrljjp46xj0nsl3eykshgusswpkkqu',
  'bc1pjlhkm8v6ljsc6l4g96kmvykqhw8lyjpmgjurs3wu32z4ernhk5gqh9s9ps',
  'bc1pc2u0x70zyqh2w6c7yjv9z4g484gsncdjtkx9cupds7gksh5p0p3s6avhr8',
  'bc1p28qr28skvrltne9rmlpstcw3wlrqjaf387m0rtuhe8fw44f277gs25x6ev',
  'bc1plm3jgwxsq3qlv0v50mwu9gvtf05uqlftf0g82m0ueh5tyzf7lx4sqj29y5',
  'bc1phlxsh3tept0rmtp5xz93y4lzpx8tx62h3wej3y8393rddy5r89xqlxh0tl',
  'bc1pgv23ctcww76xtp3my3l428pmywqwsdfe6f4y46wqjnwwg77z8snsazrefc',
  'bc1pg98kdn7lvc2096lysa6vyyk764mf6j5mq4kkz8f799j59wylx0jqpkutxn',
  'bc1pr5xl93j7crzkx0jjnzmu0p4kjxvpk7znlm82rfy7l4ppqc5k86tqn7v552',
  'bc1plxd7zqewqemks48ckarta7mga2awrxf323dv8g9pj5qvl8vxmx6qyehn66',
  'bc1p4nk2phcvzs9am6xz9v0jkapdxke6hj86xymkrga74z4f3etxtwpqmk6z0a',
  'bc1p09fv7gglfkwqnv7a5j2c2ujluayn5fhtqwqyvc3rqyuu4y8zdgks26paa0',
  'bc1p2g2vdzc0jfdzayqe7tqqvx5429n5r76u9d9qx6ft83sls2r26fyq9wsehl',
  'bc1puaqsa0vz2zvcm6h8sus9qqlmj726kcsucpk726sr24dz2ln5dqvsrx7qk8'
]

const testnetTaprootAddresses: string[] = [
  'tb1p07wnw72kkpu0q6g9uyuc25mt7dveh3gv975pxsz80c983ve3egeq9aculw',
  'tb1pjpkrlzt8hhp8a5kgwz9dg0nlkhzmvy7q3ya7qgvqstpetldjgy8qsxr7ug',
  'tb1p42l7uarg7sendj9uy7hsjkndn74flsxv85karfae2jtyladyxamqfr3sus',
  'tb1p6cskmcvwlnv5knxqhrv5wkdds7jtaj9mrq60ffk8afv0usvg647szrf2c0',
  'tb1p9xyh8v3jfsvdz94zpkhara52ldghdep3rkjl46j2gpm2y89vmr8spuhw5s',
  'tb1pjd9exlgnluupxuce33tydtr297uaa8x8fptx0p2ws2swu7uvq35sh6dt4s',
  'tb1pu2dufpqyzfzxvj4drec42fne8eyaywxwglpq8gfqj2509xke5dgq3j9zjc',
  'tb1pa3xt4ltwhj02j8ysxx3hhyk5jg9rnp7k30g79p8tq5mju377tqrs2kz4vj',
  'tb1pf9a2c7mpadvuxr7nnelwyfyqvayz9cvmv432g938g5p0ute3ehnsexcrc3',
  'tb1pnp52mmrpdfuh3nycu37x8wgp57l2u6kyf3mgwhp25tpu0f2nsx3s6yvg5k',
  'tb1ppyhmwe5slxzk4n32edhqvwv4c829xk5zcc9mmqjcar0fdfyf5pxqhg4fh3',
  'tb1ph79pqwgy4f8hjhuyskqnpuvyv437lev27nrr7gge2cczs4t5hl0sc3cnk6',
  'tb1pxw3shxwt320mex2h8ns7gxnnmqllemhf8pazsrav7fkl2jc6cy7q38z706',
  'tb1pmtny8rlsvudz3r358ejdx8cftwld0ut6zeddt2xju4tvrccm08aqedsanc',
  'tb1p9yr47zrt7hfh02y5zm0yj943klep8r0gfkj0vnjs82rh7nan3fyqekknsx',
  'tb1p7arja0w8jdpsr56yrez9tljxd7v2vanj203vsm4d7fvllq0r7hxsqccp54',
  'tb1ph0ftzsarlx30p25yx92m6f2fy7sdxq7p2h7da0kwyevf8w76lfxszm8d08',
  'tb1pmmh5v6ntwqf8swgewdg2jc5hpxwjnyrqpths9weqa5zj50vgh5yq56tjqd',
  'tb1pcjrhcpuzylurl63sss8d25ep676zxwumz0hgegj3nhv689ztc9lqrf2rjf',
  'tb1puupqwe6jfk4pmq68jnwjuac7l2a6nxdhr7jv550kndfzltu6vp3s0rs5wz',
  'tb1pn0e08yytmley9n9g682eah9g0l60729u3p98sd75a9hamj9umtuslqehpk',
  'tb1p2gascamp0udp3tr7lqqv892vtjafluq0swk5yr962cdk6yan8gaqpv2djn',
  'tb1pjmdet7mgwsjdypwyz62804j3kpemduglp9a52cz8jzn7x53yspssgnljc5',
  'tb1phssdhmpdy7p6wgzh7enz7l39hqctkcnunl9uc9gxj7mrh3d6rwgsy0mand',
  'tb1plh8d0grlgzdpr6ag5ulx59dys4zxytmlgtzsqx056u39280vmkvshlvjq4'
]

const regtestTaprootAddresses: string[] = [
  'bcrt1p43vs3dhl36as3j9zeptdf4m9a7hhzngu5ulj4u5tyjev95syru8qflep9t',
  'bcrt1pffxd5992z078uugum9cghht7wmm7l7ays2evfmn5zvsg2y8uu39shqyqju',
  'bcrt1phlzhxfkfqgnemqfh68vfs4832uftky7k7grkg3nmyhweqvymdzxq6rtkms',
  'bcrt1p4ccdg0ztpz3nde34aq8u0wcd6f4txx73zcpm87zce730dunuwvjs425qfh',
  'bcrt1pc44nylj4xxzps2tnz6wmsalanxg03wgw2vjkved46mynjhgppzss3y4qvl',
  'bcrt1pfcf4hxj58znxqzem0uzyw6kqssyjf7yuf3l0j4wt3e2kqf8ugfrsy4ytj2',
  'bcrt1par8m5fa9nqkauz4g68qdeevmqv66ru5auy9vw5mckgl2nlyz6xeswh3npz',
  'bcrt1p2zvkalcl2ffzmn2hmtywx0rnfz3h7xk7vsvex3g5229m86y8m9jszt9l8l',
  'bcrt1p0uy5wcajshz88p47kqushxsmxfmqsskast577dnq9906la0ty7tqtqp3d6',
  'bcrt1p29glkx53c499zuyajhhuk9ue3dudmyn6795g22cnmayxzvzamsdq9ayj70',
  'bcrt1pwd7f0k6tmaj0xzxexm3wqdvf9k05clh4jepuudeq88mqqdyskgkqpsf8tr',
  'bcrt1pgqmw3xzd2cq4lm7rpsqtg59fpknylpckttvsnjx2trw4yva2fhtsn05998',
  'bcrt1p97prcm39lvq3m27ncrgq78x2ne5wlxs040gq4kdsyjzc9k2zv4xsc74qep',
  'bcrt1pux7jvzhrwwqkzz97apxrdqn2rnp6fthqhcf745v39ntvl4n7gtyqfencl8',
  'bcrt1p4fwuw5dzc0pz4exxh80dxqgnnwksrqyya6th0z3pzwrrwj2wcjvqq9mnqv',
  'bcrt1p04vcnl2mncmr4y96fxu0kfcufr2cl8gwr466hf4z7r32kvqqgv8q7e97ga',
  'bcrt1pt7xcrmqzu7he424av25uhpy4gqew46ycdqderjsenml40zdx44tsxaz9hj',
  'bcrt1pzjxl92qqxwuepvrupynamrctfxh0ttac7hk2tvckst6enrwpcnkszxfp3m',
  'bcrt1p2vm3qeq8sjflract0zl2q5ksady6wpyy96w27llx30hgsuwnq2vsgyt65k',
  'bcrt1pule36zgw2uncd8p0dkuvj7rql6pyefmd406yphmv0tcdkdn50k0qzhsmr0',
  'bcrt1pg9nzv52dj69quqxksvchnhv3w36una7tvv3wljfc5ea28lhs0y6stgsxea',
  'bcrt1pk73q78xd4h2r9vxq7ltxpj67ese5kz2h8w3x7mrgd6pgljecy0vq9vr0jv',
  'bcrt1pqj6vasuggdp5azyhya6qf3gtndmkazzr225hp2ev5maf8ps99j8sy4sklw',
  'bcrt1p42mtcgrewz9kelmzmwz5uq94w47lysjvxffg6fmmr4nmaafm8ldsttwwvp',
  'bcrt1pemtmzeh0a3lftn8gt29m2q24tvzl6cd8n6qqfrk4d3kvhfuznnms7trjse'
]

const player: any = {
  name: 'lionel',
  lastname: 'messi'
}

describe('validateRequiredFields function should', () => {
  test('throw error on missing properties', () => {
    expect(() => { validateRequiredFields(player, 'name', 'age', 'height') }).toThrow()
  })

  test('specify missing properties correcty', () => {
    expect(() => { validateRequiredFields(player, 'age', 'name', 'height') })
      .toThrow('Validation failed for object with following missing properties: age, height')
  })

  test("don't throw anything when properties are not missing", () => {
    expect(() => { validateRequiredFields(player, 'name', 'lastname') }).not.toThrow()
  })
})

describe('isSecureUrl function should', () => {
  test('throw error on invalid url', () => {
    expect(() => { isSecureUrl('dasdasdagw123das') }).toThrow()
  })

  test('return true on secure URL', () => {
    expect(isSecureUrl('https://localhost:8080')).toBe(true)
  })

  test('return false on insecure URL', () => {
    expect(isSecureUrl('http://localhost:8080')).toBe(false)
  })
})

describe('isBtcAddress function should', () => {
  test('return true on valid testnet address', () => {
    testnetLegacyAddresses.concat(nativeSegwitTestnetAddresses)
      .concat(regtestNativeSegwitAddresses)
      .concat(testnetTaprootAddresses)
      .concat(regtestTaprootAddresses)
      .forEach((address) => { expect(isBtcAddress(address)).toBe(true) })
  })

  test('return true on valid mainnet address', () => {
    mainnetLegacyAddresses.concat(nativeSegwitMainnetAddresses)
      .concat(mainnetTaprootAddresses)
      .forEach((address) => { expect(isBtcAddress(address)).toBe(true) })
  })

  test('return false on invalid address', () => {
    expect(isBtcAddress('0xa2193A393aa0c94A4d52893496F02B56C61c36A1')).toBe(false)
  })
})

describe('isRskAddress function should', () => {
  test('return true on valid address', () => {
    expect(isRskAddress('0xa2193A393aa0c94A4d52893496F02B56C61c36A1')).toBe(true)
  })

  test('return false on invalid address', () => {
    expect(isRskAddress('mq4kBDAL4yDJBdd1qJk5jEffkJxvNdLxeF')).toBe(false)
  })
})

describe('isLegacyBtcAddress function should', () => {
  it.each(
    nativeSegwitMainnetAddresses.concat(nativeSegwitTestnetAddresses).concat(regtestNativeSegwitAddresses)
      .concat(mainnetTaprootAddresses).concat(testnetTaprootAddresses).concat(regtestTaprootAddresses)
  )('return false on non legacy address %s', (address: string) => {
    expect(isLegacyBtcAddress(address)).toBe(false)
  })

  it.each(testnetLegacyAddresses.concat(mainnetLegacyAddresses))('return true for legacy address %s', (address: string) => {
    expect(isLegacyBtcAddress(address)).toBe(true)
  })
})

describe('isBtcTestnetAddress function should', () => {
  test('return true on testnet address', () => {
    testnetLegacyAddresses.concat(nativeSegwitTestnetAddresses).concat(regtestNativeSegwitAddresses)
      .concat(testnetTaprootAddresses).concat(regtestTaprootAddresses)
      .forEach((address) => { expect(isBtcTestnetAddress(address)).toBe(true) })
  })
  test('return false on mainnet address', () => {
    mainnetLegacyAddresses.concat(nativeSegwitMainnetAddresses).concat(mainnetTaprootAddresses)
      .forEach((address) => { expect(isBtcTestnetAddress(address)).toBe(false) })
  })
})

describe('isBtcMainnetAddress function should', () => {
  test('return true on mainnet address', () => {
    mainnetLegacyAddresses.concat(nativeSegwitMainnetAddresses).concat(mainnetTaprootAddresses)
      .forEach(address => { expect(isBtcMainnetAddress(address)).toBe(true) })
  })
  test('return false on testnet address', () => {
    testnetLegacyAddresses.concat(nativeSegwitTestnetAddresses).concat(regtestNativeSegwitAddresses)
      .concat(testnetTaprootAddresses).concat(regtestTaprootAddresses)
      .forEach((address) => { expect(isBtcMainnetAddress(address)).toBe(false) })
  })
})

describe('isBtcNativeSegwitAddress function should', () => {
  test('return true on native segwit address', () => {
    nativeSegwitMainnetAddresses.concat(nativeSegwitTestnetAddresses).concat(regtestNativeSegwitAddresses)
      .forEach((address) => { expect(isBtcNativeSegwitAddress(address)).toBe(true) })
  })

  test('return false on non native segwit address', () => {
    mainnetTaprootAddresses
      .concat(testnetTaprootAddresses)
      .concat(regtestTaprootAddresses)
      .concat(mainnetLegacyAddresses)
      .concat(testnetLegacyAddresses)
      .forEach((address) => { expect(isBtcNativeSegwitAddress(address)).toBe(false) })
  })
})

describe('isTaprootAddress function should', () => {
  test('return true on taproot address', () => {
    mainnetTaprootAddresses.concat(testnetTaprootAddresses).concat(regtestTaprootAddresses)
      .forEach((address) => { expect(isTaprootAddress(address)).toBe(true) })
  })

  test('return false on non taproot address', () => {
    nativeSegwitMainnetAddresses
      .concat(nativeSegwitTestnetAddresses)
      .concat(regtestNativeSegwitAddresses)
      .concat(mainnetLegacyAddresses)
      .concat(testnetLegacyAddresses)
      .forEach((address) => { expect(isTaprootAddress(address)).toBe(false) })
  })
})

describe('isValidSignature function should', () => {
  test('return true on valid signature of hex message', () => {
    expect(
      isValidSignature(
        '0xD839C223634b224327430Bb7062858109C850bf9',
        '4af4cced069b4ac33fa19c7f63e196ecf08da0f5fea66988722290da5fa883a2',
        'd0e0169077b37ab5f46571d86de3c883baff364acb9ab299d961c1bfdaef7cb116e06ec7a0a95d7b1d79e99b55f2db13a1e0d1d8b1b5525d98c31959704075961b'
      )
    ).toBe(true)

    expect(
      isValidSignature(
        '0xD839C223634b224327430Bb7062858109C850bf9',
        '7803021a2b9356037ba6861e342ea378bf1210b779ea606fbe9a10ca90784930',
        '1592f12f35443e87fc848d8809f599d237b1e62dfbd950331009fed3a7508ed41fa298ec19da8e278ad7fca90e353f7f9f8e30e6c4641b1e5eaaad88f42f7ed91b'
      )
    ).toBe(true)

    expect(
      isValidSignature(
        '0xAFf2c034FD8Bc690e62A897BbC5A6C4dF2321992',
        'fc4a342e2e2ebe0186964a99f723deee951bd056d5a9548ec481318d6a89fb3f',
        'a4f572b80217b2dae255d716a132db2eb5991e2ffb35c8692c7c98e72b9ce28264d9de32977296aadb46468d952751d1d313b1b51ea56ab532c84a4852162b0b1b'
      )
    ).toBe(true)
  })

  test('return true on valid signature of non hex message', () => {
    expect(
      isValidSignature(
        '0x57f9F71E683E2A8ff3d2f394aE45C58b2d913A35',
        'test message',
        '0x318b8de0855be18d1e0061e7b18497d43d54022f8dc610ecd5c64d1153eff6010d96242476d0067a144a59f93ff43e6a467a7ad3d6145a9006a83d4cafbbc04a1c',
        false
      )
    ).toBe(true)

    expect(
      isValidSignature(
        '0x57f9F71E683E2A8ff3d2f394aE45C58b2d913A35',
        '0x74657374206d657373616765',
        '0x1d246d9e91d1b372d266678f9ce915522912d88c5ce918364b442702a0ef591274083f4af0f483a794a965e74cfcf76ace04067c0ffbf14862acbb5ab0a8ad5d1b',
        false
      )
    ).toBe(true)
  })

  test('return false on invalid signature of hex message', () => {
    expect(
      isValidSignature(
        '0xd6F117d8194Eba2fCA8bD63B2E259Dbea40E07d9',
        '238ebf0e6821f6654233f2e6067ceb705fede21dd3791649073dad84f6d43f9b',
        'bcc307e6acc303dceea85fc2e0a8c3a094ad2d5ac2eb0157a19ae723f4fe150e18483e8b895e528168135dd8eef95ba0307eba1e8e1e90ba2c8357dc3ffc9ad61b'
      )
    ).toBe(false)

    expect(
      isValidSignature(
        '0xb42c26BB804987EE7FEFb897eB18ED775da19Fe4',
        '2164d98621ac858c1461bc14425f703d58ccbb476dbe5ba3899450b3a53cf93e',
        '66496eafdf51c457cb65ac01bd0397b5e0c5f4001dc1def165b4226cea2ab5636d1935ad78ec42b334ba57dd752521a2b967a4a316848138fdba96534247891f1c'
      )
    ).toBe(false)

    expect(
      isValidSignature(
        '0x2aCc95758f8b5F583470bA265Eb685a8f45fC9D5',
        '6f84d2881de5ae7ea571309611740daeb297a154353c1f6de37c8339f090f1b8',
        'f2943e7cbc97db6b4bddabca5500accb635c9ea83cbd9728d73e385bb0d7f95c14cc32e10738e214997701f5db10bd8fd72d132f45f114f56b74749fabc696aa1c'
      )
    ).toBe(false)
  })

  test('return false on invalid signature of non hex message', () => {
    expect(
      isValidSignature(
        '0x9D93929A9099be4355fC2389FbF253982F9dF47c',
        'test message error',
        '0xec35ef58bdee37797436106fc63fec3d5301ff99ff311638a056cca5878c53f505f8ea9f29de342579a0c83107aed1eb2fe8862c3fe3949ea24b6e49dd3320901c',
        false
      )
    ).toBe(false)

    expect(
      isValidSignature(
        '0x9D93929A9099be4355fC2389FbF253982F9dF47c',
        '0x7269636172646f206d696c6f73',
        '0xc5bc45b5bdc10163588e85578771eb4b6256df30196de914ce572049107ab9041952234c42ac67e60f56d8e93907f44f148b3d9b61830f5f9a9d2f7525b277d61a',
        false
      )
    ).toBe(false)
  })

  test('return true if the signature is valid regardless of the address checksum', () => {
    const signature = '2ccc4b6b15da4cac68329bec3497646cd8531d5da3ab2cce241c50447c9129df7e90205bb14490c5512ab2e722e3b85fc605a5037b14adceff205b125e580cec1c'
    const address = '0x57f9F71E683E2A8ff3d2f394aE45C58b2d913A35'
    const quoteHash = 'fc4a342e2e2ebe0186964a99f723deee951bd056d5a9548ec481318d6a89fb3f'
    const rskChecksumAddress = rskChecksum(address, 31)
    const ethChecksumAddress = ethers.utils.getAddress(address)
    expect(isValidSignature(address.toLowerCase(), quoteHash, signature)).toBe(true)
    expect(isValidSignature(rskChecksumAddress, quoteHash, signature)).toBe(true)
    expect(isValidSignature(ethChecksumAddress, quoteHash, signature)).toBe(true)
  })
})

describe('assertTruthy function should', () => {
  [undefined, null, '', false, 0, NaN].forEach((falsy: unknown) => {
    test('throw error on ' + String(falsy), () => {
      expect(() => { assertTruthy(falsy) }).toThrowError('unexpected falsy value')
    })
  })

  test('throw error with proper message', () => {
    expect(() => { assertTruthy(false) }).toThrowError('unexpected falsy value')
    expect(() => { assertTruthy(false, 'custom message') }).toThrowError('custom message')
  })

  test('not throw error on truthy parameter', () => {
    const cases: unknown[] = [{}, [], true, 'test', -1, 33]
    cases.forEach(testCase => {
      expect(() => { assertTruthy(testCase) }).not.toThrow()
    })
  })
})

const mainnetChecksummedRskAddresses = [
  '0x27b1FdB04752BBc536007A920D24ACB045561c26',
  '0x3599689E6292B81B2D85451025146515070129Bb',
  '0x42712D45473476B98452f434E72461577d686318',
  '0x52908400098527886E0F7030069857D2E4169ee7',
  '0x5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD',
  '0x6549F4939460DE12611948B3F82B88C3C8975323',
  '0x66F9664f97f2B50F62d13EA064982F936de76657',
  '0x8617E340b3D01Fa5f11f306f4090fd50E238070D',
  '0x88021160c5C792225E4E5452585947470010289d',
  '0xD1220A0Cf47c7B9BE7a2e6ba89F429762E7B9adB',
  '0xDBF03B407c01E7CD3cBea99509D93F8Dddc8C6FB',
  '0xDe709F2102306220921060314715629080e2FB77',
  '0xFb6916095cA1Df60bb79ce92cE3EA74c37c5d359'
]

const testnetChecksummedRskAddresses = [
  '0x27B1FdB04752BbC536007a920D24acB045561C26',
  '0x3599689e6292b81b2D85451025146515070129Bb',
  '0x42712D45473476B98452F434E72461577D686318',
  '0x52908400098527886E0F7030069857D2e4169EE7',
  '0x5aAeb6053F3e94c9b9A09F33669435E7EF1BEaEd',
  '0x6549f4939460dE12611948b3f82b88C3c8975323',
  '0x66f9664F97F2b50f62d13eA064982F936DE76657',
  '0x8617e340b3D01fa5F11f306F4090Fd50e238070d',
  '0x88021160c5C792225E4E5452585947470010289d',
  '0xd1220a0CF47c7B9Be7A2E6Ba89f429762E7b9adB',
  '0xdbF03B407C01E7cd3cbEa99509D93f8dDDc8C6fB',
  '0xDE709F2102306220921060314715629080e2Fb77',
  '0xFb6916095CA1dF60bb79CE92ce3Ea74C37c5D359'
]

const ethereumChecksummedAddresses = [
  '0x27b1fdb04752bbc536007a920d24acb045561c26',
  '0x3599689E6292b81B2d85451025146515070129Bb',
  '0x42712D45473476b98452f434e72461577D686318',
  '0x52908400098527886E0F7030069857D2E4169EE7',
  '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
  '0x6549f4939460DE12611948b3f82b88C3C8975323',
  '0x66f9664f97F2b50F62D13eA064982f936dE76657',
  '0x8617E340B3D01FA5F11F306F4090FD50E238070D',
  '0x88021160C5C792225E4E5452585947470010289D',
  '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb',
  '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB',
  '0xde709f2102306220921060314715629080e2fb77',
  '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359'
]

describe('rskChecksum function should', () => {
  test('return proper checksum address for mainnet', () => {
    mainnetChecksummedRskAddresses.forEach(address => { expect(rskChecksum(address, 30)).toBe(address) })
  })

  test('return proper checksum address for testnet', () => {
    testnetChecksummedRskAddresses.forEach(address => { expect(rskChecksum(address, 31)).toBe(address) })
  })

  test('fail on malformed addresses', () => {
    [
      '27B1FdB04752BbC536007a920D24acB045561C26',
      '0x3599689e6292b81b2D85451025146515070129B',
      '0x2712D45473476B98452F434E72461577D686318',
      'anything',
      '0x5aJAeb6053F3e94c9b9A09F33669435E7EF1BEaEd',
      '0x6549J4939460dE12611948b3f82b88C3c8975323',
      '0x66f9d64F97F2b50v62d13eA064982F936DE76657'
    ].forEach(address => { expect(() => { rskChecksum(address, 31) }).toThrow('Invalid RSK address') })
  })
})

describe('rskChecksum function should', () => {
  test('return true if address has valid checksum checksum', () => {
    mainnetChecksummedRskAddresses.forEach(address => { expect(isRskChecksummedAddress(address, 30)).toBe(true) })
    testnetChecksummedRskAddresses.forEach(address => { expect(isRskChecksummedAddress(address, 31)).toBe(true) })
  })

  test('return false if address has other network checksum', () => {
    // we need to exclude the cases where the checksum happens to be the same for both networks
    const mainnetAddresses = mainnetChecksummedRskAddresses.filter(address => !testnetChecksummedRskAddresses.includes(address))
    const testnetAddresses = testnetChecksummedRskAddresses.filter(address => !mainnetChecksummedRskAddresses.includes(address))

    ethereumChecksummedAddresses.forEach(address => {
      expect(isRskChecksummedAddress(address, 30)).toBe(false)
      expect(isRskChecksummedAddress(address, 31)).toBe(false)
    })
    mainnetAddresses.forEach(address => { expect(isRskChecksummedAddress(address, 31)).toBe(false) })
    testnetAddresses.forEach(address => { expect(isRskChecksummedAddress(address, 30)).toBe(false) })
  })

  test('return false if address is not checksummed', () => {
    mainnetChecksummedRskAddresses.map(address => address.toLowerCase())
      .forEach(address => { expect(isRskChecksummedAddress(address, 30)).toBe(false) })
    testnetChecksummedRskAddresses.map(address => address.toLowerCase())
      .forEach(address => { expect(isRskChecksummedAddress(address, 31)).toBe(false) })
  })
})

describe('isBtcZeroAddress function should', () => {
  const NOT_ZERO_ADDRESS = '1EdKLcM9JPoXNs2RutHiBTRvkHPmQfFwWw'

  test('return true for mainnet zero address', () => {
    const config = { network: 'Mainnet' as Network }
    expect(isBtcZeroAddress(config, BTC_ZERO_ADDRESS_MAINNET)).toBe(true)
  })

  test('return true for testnet zero address', () => {
    const config = { network: 'Testnet' as Network }
    expect(isBtcZeroAddress(config, BTC_ZERO_ADDRESS_TESTNET)).toBe(true)
  })

  test('return false for non-zero mainnet address', () => {
    const config = { network: 'Mainnet' as Network }
    expect(isBtcZeroAddress(config, NOT_ZERO_ADDRESS)).toBe(false)
  })

  test('return false for non-zero testnet address', () => {
    const config = { network: 'Testnet' as Network }
    expect(isBtcZeroAddress(config, NOT_ZERO_ADDRESS)).toBe(false)
  })

  test('return false when network and address type mismatch', () => {
    const mainnetConfig = { network: 'Mainnet' as Network }
    const testnetConfig = { network: 'Testnet' as Network }

    // Test testnet zero address with mainnet config
    expect(isBtcZeroAddress(mainnetConfig, BTC_ZERO_ADDRESS_TESTNET)).toBe(false)

    // Test mainnet zero address with testnet config
    expect(isBtcZeroAddress(testnetConfig, BTC_ZERO_ADDRESS_MAINNET)).toBe(false)
  })
})
