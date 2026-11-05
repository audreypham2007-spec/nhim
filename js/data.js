/* Nhím course content. Standard Vietnamese spelling.
   Where North and South differ, the main form is listed first and the other is accepted as an alternate.
   Optional 4th element on a word: "N" or "S" if the main form is mainly Northern or Southern. */
window.NHIM = {
  TONES: [
    {name:"ngang", en:"level", mark:"no mark", ex:"ma", mean:"ghost", contour:[[0,3.5],[1,3.5]]},
    {name:"sắc", en:"rising", mark:"á", ex:"má", mean:"mom (South) / cheek", contour:[[0,3],[0.35,3.2],[1,5]]},
    {name:"huyền", en:"falling", mark:"à", ex:"mà", mean:"but", contour:[[0,2.5],[1,1.5]]},
    {name:"hỏi", en:"dipping", mark:"ả", ex:"mả", mean:"grave", contour:[[0,2.5],[0.5,1.5],[1,2.5]]},
    {name:"ngã", en:"rising, broken", mark:"ã", ex:"mã", mean:"horse (Sino-Vietnamese) / code", contour:[[0,3],[0.45,3.3],[0.55,3.8],[1,5]]},
    {name:"nặng", en:"heavy, low", mark:"ạ", ex:"mạ", mean:"rice seedling", contour:[[0,2.5],[0.35,2],[0.6,1]]}
  ],

  UNITS: [
    { id:"u1", title:"Greetings", vi:"Chào hỏi", color:"#1F6B4F", scene:"terraces",
      tip:"Vietnamese has six tones, and the mark changes the meaning. Say vâng (North) or dạ (South) for a polite yes. Ending with ạ makes any sentence more respectful: Cảm ơn ạ.",
      words:[
        ["xin chào","hello"],["chào","hi"],["tạm biệt","goodbye"],["cảm ơn","thank you",["cám ơn"]],
        ["xin lỗi","sorry"],["vâng","yes (polite)",["dạ"],"N"],["không","no"],["bạn","you (friend)"],
        ["tôi","I / me"],["khỏe","well, healthy",["khoẻ"]],["tên","name"],["là","to be (is, am)"],
        ["gặp","to meet"],["rất","very"]
      ],
      phrases:[
        ["Xin chào!","Hello!"],["Cảm ơn bạn.","Thank you."],["Bạn khỏe không?","How are you?"],
        ["Tôi khỏe, cảm ơn.","I'm fine, thank you."],["Bạn tên là gì?","What is your name?"],
        ["Tên tôi là Lan.","My name is Lan."],["Rất vui được gặp bạn.","Nice to meet you."],
        ["Không có gì.","You're welcome."],["Hẹn gặp lại!","See you again!"]
      ],
      fill:[
        ["Bạn ___ không?","khỏe",["tên","tạm biệt"],"How are you?"],
        ["Tên tôi ___ Lan.","là",["gặp","xin lỗi"],"My name is Lan."],
        ["Xin ___!","chào",["tên","khỏe"],"Hello!"],
        ["Không có ___.","gì",["chào","khỏe"],"You're welcome."]
      ]
    },

    { id:"u2", title:"Family", vi:"Gia đình", color:"#2B3A67", scene:"home",
      tip:"Family words double as pronouns. You call an older man anh and an older woman chị, and they call you em. Mẹ and bố are common in the North. Má and ba are common in the South.",
      words:[
        ["gia đình","family"],["mẹ","mother",["má"]],["bố","father",["ba"],"N"],["anh","older brother"],
        ["chị","older sister"],["em","younger sibling"],["ông","grandfather"],["bà","grandmother"],
        ["con","child"],["bạn bè","friends"],["con trai","son / boy"],["con gái","daughter / girl"],
        ["chú","uncle (dad's younger brother)"],["dì","aunt (mom's sister)"]
      ],
      phrases:[
        ["Đây là mẹ tôi.","This is my mother."],["Tôi có một chị gái.","I have an older sister."],
        ["Anh ấy là anh trai tôi.","He is my older brother."],["Gia đình tôi có năm người.","My family has five people."],
        ["Bà tôi rất hiền.","My grandmother is very kind."],["Em gái tôi đi học.","My younger sister goes to school."],
        ["Ba má tôi ở Mỹ.","My parents live in America."],["Chú tôi có hai đứa con.","My uncle has two kids."],
        ["Đây là con gái tôi.","This is my daughter."]
      ],
      fill:[
        ["Đây là ___ tôi.","mẹ",["phở","màu"],"This is my mother."],
        ["Tôi có một ___ gái.","chị",["cơm","tên"],"I have an older sister."],
        ["Gia đình tôi có năm ___.","người",["màu","cà phê"],"My family has five people."]
      ]
    },

    { id:"u3", title:"Numbers", vi:"Số đếm", color:"#C0432F", scene:"market",
      tip:"After mười or mươi, năm (5) becomes lăm: mười lăm = 15. After mươi, một (1) becomes mốt: hai mươi mốt = 21. Năm also means year. Nghìn (North) and ngàn (South) both mean thousand.",
      words:[
        ["một","one (1)"],["hai","two (2)"],["ba","three (3)"],["bốn","four (4)"],["năm","five (5)"],
        ["sáu","six (6)"],["bảy","seven (7)"],["tám","eight (8)"],["chín","nine (9)"],["mười","ten (10)"],
        ["mươi","tens (-ty)"],["trăm","hundred"],["nghìn","thousand",["ngàn"],"N"],["tuổi","years old"]
      ],
      phrases:[
        ["mười một","eleven (11)"],["mười lăm","fifteen (15)"],["hai mươi","twenty (20)"],
        ["hai mươi mốt","twenty-one (21)"],["một trăm","one hundred (100)"],["một nghìn","one thousand (1,000)"],
        ["Tôi mười tám tuổi.","I am eighteen years old."],["Bạn bao nhiêu tuổi?","How old are you?"],
        ["Bao nhiêu?","How much? / How many?"]
      ],
      fill:[
        ["mười ___ (15)","lăm",["năm","mốt"],"fifteen"],
        ["hai mươi ___ (21)","mốt",["một","lăm"],"twenty-one"],
        ["Tôi mười tám ___.","tuổi",["tên","nhà"],"I am eighteen years old."]
      ]
    },

    { id:"u4", title:"Food", vi:"Đồ ăn", color:"#2C7A7B", scene:"market",
      tip:"Ly and cốc (North) both mean a cup or glass. Tô (South) and bát (North) both mean a bowl. Cơm means cooked rice and also a whole meal: ăn cơm = to eat a meal.",
      words:[
        ["phở","pho (noodle soup)"],["cơm","cooked rice / meal"],["nước","water"],["cà phê","coffee"],
        ["trà","tea"],["bánh mì","bread / sandwich"],["gà","chicken"],["bò","beef"],["rau","vegetables"],
        ["ngon","delicious"],["ăn","to eat"],["uống","to drink"],["ly","glass, cup",["cốc"]],["cá","fish"]
      ],
      phrases:[
        ["Tôi muốn ăn phở.","I want to eat pho."],["Món này rất ngon!","This dish is very delicious!"],
        ["Cho tôi một ly cà phê.","A cup of coffee, please."],["Tôi đói.","I'm hungry."],
        ["Tôi khát nước.","I'm thirsty."],["Cho tôi tính tiền.","The check, please."],["Tôi ăn chay.","I'm vegetarian."],
        ["Ăn cơm chưa?","Have you eaten yet?"],["Cho tôi một tô phở.","A bowl of pho, please."]
      ],
      fill:[
        ["Tôi ___ phở.","ăn",["uống","ngủ"],"I eat pho."],
        ["Cho tôi một ly ___.","cà phê",["cơm","bánh mì"],"A cup of coffee, please."],
        ["Món này rất ___!","ngon",["tên","bốn"],"This dish is very delicious!"]
      ]
    },

    { id:"u5", title:"Questions", vi:"Câu hỏi", color:"#5B3A29", scene:"city",
      tip:"Add không? at the end to make a yes or no question: Bạn có hiểu không? Answer có (yes) or không (no). Question words often go at the end: Bạn đi đâu?",
      words:[
        ["gì","what"],["ai","who"],["ở đâu","where"],["khi nào","when"],["tại sao","why",["sao"]],
        ["bao nhiêu","how much / how many"],["thế nào","how"],["có","yes / to have"],["tiền","money"],
        ["cái này","this (thing)"],["mấy","how many (small number)"],["nào","which"],["hiểu","to understand"],["nói","to speak"]
      ],
      phrases:[
        ["Bạn đi đâu?","Where are you going?"],["Cái này bao nhiêu tiền?","How much is this?"],
        ["Nhà vệ sinh ở đâu?","Where is the restroom?"],["Đây là cái gì?","What is this?"],
        ["Bạn có hiểu không?","Do you understand?"],["Tôi không hiểu.","I don't understand."],
        ["Bạn nói chậm lại được không?","Can you speak more slowly?"],
        ["Bạn nói tiếng Việt được không?","Can you speak Vietnamese?"],["Cái nào?","Which one?"]
      ],
      fill:[
        ["Bạn tên là ___?","gì",["bao nhiêu","khi nào"],"What is your name?"],
        ["Nhà vệ sinh ở ___?","đâu",["gì","ai"],"Where is the restroom?"],
        ["Cái này bao nhiêu ___?","tiền",["ai","tên"],"How much is this?"],
        ["Bạn có hiểu ___?","không",["tiền","tên"],"Do you understand?"]
      ]
    },

    { id:"u6", title:"Daily life", vi:"Hằng ngày", color:"#B7791F", scene:"city",
      tip:"Verbs never change form. Small words mark time: đã (past), đang (happening now), sẽ (future). Rồi at the end means already.",
      words:[
        ["đi","to go"],["học","to study"],["làm việc","to work"],["ngủ","to sleep"],["nhà","house / home"],
        ["trường","school"],["hôm nay","today"],["ngày mai","tomorrow"],["hôm qua","yesterday"],["bây giờ","now"],
        ["dậy","to get up"],["về","to return, go home"],["tắm","to shower, bathe"],["ăn sáng","to eat breakfast"]
      ],
      phrases:[
        ["Tôi đi học.","I go to school."],["Hôm nay tôi làm việc.","Today I work."],
        ["Ngày mai tôi về nhà.","Tomorrow I go home."],["Tôi đã ăn rồi.","I already ate."],
        ["Tôi sẽ ngủ sớm.","I will sleep early."],["Bây giờ là mấy giờ?","What time is it now?"],
        ["Tôi dậy lúc sáu giờ.","I get up at six."],["Tôi đang ăn sáng.","I'm eating breakfast."]
      ],
      fill:[
        ["Tôi ___ ăn rồi.","đã",["sẽ","ngày mai"],"I already ate."],
        ["Ngày mai tôi ___ đi học.","sẽ",["đã","hôm qua"],"Tomorrow I will go to school."],
        ["Tôi đi ___.","học",["khỏe","bao nhiêu"],"I go to school."]
      ]
    },

    { id:"u7", title:"Feelings", vi:"Cảm xúc", color:"#1F6B4F", scene:"river",
      tip:"Put quá after a feeling to mean so or too: mệt quá = so tired. Rất goes before it: rất vui = very happy. Thương is a warm word for love, used a lot in Southern families.",
      words:[
        ["vui","happy"],["buồn","sad"],["mệt","tired"],["đói","hungry"],["no","full (after eating)"],
        ["thích","to like"],["yêu","to love"],["sợ","afraid"],["giận","angry"],["nhớ","to miss / remember"],
        ["lo","worried"],["chán","bored"],["quá","so, too"],["thương","to love, care for"]
      ],
      phrases:[
        ["Tôi rất vui.","I'm very happy."],["Tôi thích học tiếng Việt.","I like studying Vietnamese."],
        ["Em mệt quá.","I'm so tired."],["Con yêu mẹ.","I love you, Mom."],["Tôi nhớ nhà.","I miss home."],
        ["Đừng buồn nhé.","Don't be sad."],["Tôi chán quá.","I'm so bored."],["Đừng lo.","Don't worry."],
        ["Má thương con lắm.","Mom loves you so much."]
      ],
      fill:[
        ["Tôi mệt ___.","quá",["rất","gì"],"I'm so tired."],
        ["Con ___ mẹ.","yêu",["đói","đỏ"],"I love you, Mom."],
        ["Tôi ___ nhà.","nhớ",["khát","bao nhiêu"],"I miss home."]
      ]
    },

    { id:"u8", title:"Colors", vi:"Màu sắc", color:"#C0432F", scene:"terraces",
      tip:"Xanh alone can mean blue or green. Add dương (ocean) for blue or lá (leaf) for green. Vàng means yellow and also gold. Southerners often say bông for hoa (flower).",
      words:[
        ["màu","color"],["đỏ","red"],["vàng","yellow"],["xanh dương","blue"],["xanh lá","green"],
        ["trắng","white"],["đen","black"],["hồng","pink"],["tím","purple"],["cam","orange"],
        ["nâu","brown"],["xám","gray",["ghi"]],["hoa","flower",["bông"]],["áo","shirt, top"]
      ],
      phrases:[
        ["Áo này màu đỏ.","This shirt is red."],["Tôi thích màu xanh dương.","I like the color blue."],
        ["Con mèo màu đen.","The cat is black."],["Hoa này màu hồng.","This flower is pink."],
        ["Bạn thích màu gì?","What color do you like?"],["Tôi thích áo màu trắng.","I like white shirts."],
        ["Áo dài của mẹ màu tím.","Mom's áo dài is purple."]
      ],
      fill:[
        ["Con mèo màu ___.","đen",["ngon","mệt"],"The cat is black."],
        ["Tôi thích màu xanh ___.","dương",["ngon","buồn"],"I like the color blue."],
        ["Bạn thích màu ___?","gì",["ai","đâu"],"What color do you like?"]
      ]
    },

    { id:"u9", title:"Time and dates", vi:"Thời gian", color:"#2B3A67", scene:"river",
      tip:"Weekdays are numbered: thứ hai is Monday, thứ ba is Tuesday, up to thứ bảy (Saturday). Sunday is chủ nhật. Use tư, not bốn, for 4 in days and months: thứ tư, tháng tư. Rưỡi means half past: hai giờ rưỡi = 2:30.",
      words:[
        ["giờ","hour, o'clock"],["phút","minute"],["rưỡi","half (past)"],["sáng","morning"],
        ["trưa","noon"],["chiều","afternoon"],["tối","evening"],["ngày","day, date"],["tuần","week"],
        ["tháng","month"],["năm nay","this year"],["thứ hai","Monday"],["chủ nhật","Sunday"],["sinh nhật","birthday"]
      ],
      phrases:[
        ["Bây giờ là ba giờ rưỡi.","It's three thirty now."],["Hôm nay là thứ mấy?","What day is it today?"],
        ["Hôm nay là thứ hai.","Today is Monday."],["Sinh nhật của bạn là ngày nào?","When is your birthday?"],
        ["Tôi học lúc tám giờ sáng.","I study at 8 a.m."],["Hẹn gặp lại tuần sau.","See you next week."],
        ["Một tuần có bảy ngày.","A week has seven days."]
      ],
      fill:[
        ["Bây giờ là hai ___ rưỡi.","giờ",["tháng","tuần"],"It's two thirty now."],
        ["Tôi học lúc tám giờ ___.","sáng",["tuần","tháng"],"I study at 8 a.m."],
        ["Một tuần có bảy ___.","ngày",["tháng","năm"],"A week has seven days."]
      ]
    },

    { id:"u10", title:"Shopping and money", vi:"Mua sắm", color:"#B7791F", scene:"market",
      tip:"Prices are in đồng, and people often drop the nghìn: năm chục means 50,000 đồng. Đắt (North) and mắc (South) both mean expensive. Bargaining is normal at the market, so ask the seller to bớt.",
      words:[
        ["mua","to buy"],["bán","to sell"],["đồng","dong (money)"],["giá","price"],["đắt","expensive",["mắc"],"N"],
        ["rẻ","cheap"],["bớt","to lower (a price)"],["trả","to pay"],["chợ","market"],["tiền mặt","cash"],
        ["thẻ","card"],["cửa hàng","shop, store",["tiệm"]],["hoa quả","fruit",["trái cây"],"N"]
      ],
      phrases:[
        ["Cái áo này giá bao nhiêu?","How much is this shirt?"],["Đắt quá!","Too expensive!"],
        ["Chị bớt cho em đi.","Please lower the price for me."],["Năm mươi nghìn đồng.","Fifty thousand dong."],
        ["Tôi trả bằng thẻ được không?","Can I pay by card?"],["Rẻ quá!","So cheap!"],
        ["Tôi chỉ xem thôi.","I'm just looking."],["Tôi đi chợ mua rau.","I go to the market to buy vegetables."]
      ],
      fill:[
        ["Cái này ___ quá!","đắt",["mấy","ai"],"This is too expensive!"],
        ["Tôi trả bằng ___.","thẻ",["chợ","giá"],"I pay by card."],
        ["Tôi đi ___ mua rau.","chợ",["thẻ","giá"],"I go to the market to buy vegetables."]
      ]
    },

    { id:"u11", title:"Getting around", vi:"Đi lại", color:"#2C7A7B", scene:"city",
      tip:"Rẽ (North) and quẹo (South) both mean turn. Rẽ trái is turn left and rẽ phải is turn right. A xe ôm is a motorbike taxi, and many people book rides on the Grab app.",
      words:[
        ["xe máy","motorbike"],["xe ôm","motorbike taxi"],["tắc xi","taxi",["taxi"]],["xe buýt","bus"],
        ["máy bay","airplane"],["sân bay","airport"],["đường","road, street"],["rẽ","to turn",["quẹo"],"N"],
        ["trái","left"],["phải","right"],["đi thẳng","go straight"],["gần","near"],["xa","far"],["khách sạn","hotel"]
      ],
      phrases:[
        ["Rẽ trái ở đây.","Turn left here."],["Đi thẳng nhé.","Go straight."],["Cho tôi xuống đây.","Let me off here."],
        ["Sân bay có xa không?","Is the airport far?"],["Khách sạn ở gần đây.","The hotel is near here."],
        ["Tôi đi xe máy.","I ride a motorbike."],["Tôi đặt Grab rồi.","I already booked a Grab."]
      ],
      fill:[
        ["Rẽ ___ ở đây.","trái",["xa","gần"],"Turn left here."],
        ["Sân bay có ___ không?","xa",["trái","thẳng"],"Is the airport far?"],
        ["Tôi đi ___ máy.","xe",["sân","đường"],"I ride a motorbike."]
      ]
    },

    { id:"u12", title:"Weather and seasons", vi:"Thời tiết", color:"#5B3A29", scene:"mountains",
      tip:"Trời means sky, and weather sentences start with it: Trời nóng = It's hot. Mùa means season. Southern Vietnam has two seasons, mùa mưa (rainy) and mùa khô (dry).",
      words:[
        ["trời","sky, weather"],["nóng","hot"],["lạnh","cold"],["mưa","rain"],["nắng","sunny"],
        ["gió","wind"],["mát","cool"],["ấm","warm"],["mây","cloud"],["mùa","season"],
        ["mùa xuân","spring"],["mùa hè","summer",["mùa hạ"]],["mùa thu","autumn"],["mùa đông","winter"]
      ],
      phrases:[
        ["Hôm nay trời nóng quá.","It's so hot today."],["Trời đang mưa.","It's raining."],
        ["Ngày mai trời có mưa không?","Will it rain tomorrow?"],["Tôi thích mùa thu.","I like autumn."],
        ["Ở đây mùa đông lạnh lắm.","Winter here is very cold."],["Trời nắng đẹp.","It's sunny and nice."],
        ["Mang áo mưa nhé.","Bring a raincoat."]
      ],
      fill:[
        ["Trời đang ___.","mưa",["mùa","đói"],"It's raining."],
        ["Mùa đông rất ___.","lạnh",["ngon","đói"],"Winter is very cold."],
        ["Tôi thích mùa ___.","thu",["trời","gió"],"I like autumn."]
      ]
    },

    { id:"u13", title:"Body and health", vi:"Sức khỏe", color:"#1F6B4F", scene:"city",
      tip:"Use đau with a body part: đau đầu = headache, đau bụng = stomachache. Bị ốm (North) and bị bệnh (South) both mean sick. In the South, ốm also means thin. Uống thuốc means to take medicine.",
      words:[
        ["đầu","head"],["bụng","stomach"],["tay","hand, arm"],["chân","leg, foot"],["mắt","eye"],
        ["răng","tooth"],["đau","to hurt, pain"],["bị bệnh","sick",["bị ốm"]],["sốt","fever"],["ho","to cough"],
        ["thuốc","medicine"],["bác sĩ","doctor"],["bệnh viện","hospital"],["nhà thuốc","pharmacy",["tiệm thuốc"]]
      ],
      phrases:[
        ["Tôi bị đau đầu.","I have a headache."],["Tôi bị sốt.","I have a fever."],
        ["Bạn bị sao vậy?","What's wrong?"],["Tôi cần gặp bác sĩ.","I need to see a doctor."],
        ["Nhà thuốc ở đâu?","Where is the pharmacy?"],["Mỗi ngày uống thuốc ba lần.","Take the medicine three times a day."],
        ["Chúc bạn mau khỏe.","Get well soon."]
      ],
      fill:[
        ["Tôi bị đau ___.","bụng",["mưa","xe"],"I have a stomachache."],
        ["Tôi cần gặp ___.","bác sĩ",["thuốc","răng"],"I need to see a doctor."],
        ["Mỗi ngày uống ___ ba lần.","thuốc",["chân","mắt"],"Take the medicine three times a day."]
      ]
    },

    { id:"u14", title:"School and work", vi:"Học và làm", color:"#2B3A67", scene:"school",
      tip:"Học sinh is a K-12 student and sinh viên is a college student. Call a male teacher thầy and a female teacher cô, and answer them with dạ. Many Southerners call a pen cây viết.",
      words:[
        ["lớp","class"],["thầy giáo","male teacher"],["cô giáo","female teacher"],["học sinh","student (K-12)"],
        ["sinh viên","college student"],["bài tập","homework"],["sách","book"],["bút","pen",["viết","cây viết"]],
        ["thi","to take an exam"],["giỏi","good at, smart"],["công ty","company"],["công việc","job, work"],
        ["đồng nghiệp","coworker"],["văn phòng","office"]
      ],
      phrases:[
        ["Em chào cô ạ.","Hello, teacher. (to a woman)"],["Tôi là sinh viên.","I'm a college student."],
        ["Ngày mai em thi.","I have an exam tomorrow."],["Bạn làm nghề gì?","What do you do for work?"],
        ["Tôi làm ở văn phòng.","I work in an office."],["Em làm bài tập chưa?","Did you do your homework?"],
        ["Bạn ấy học rất giỏi.","That friend is a very good student."]
      ],
      fill:[
        ["Em làm ___ chưa?","bài tập",["lớp","cô giáo"],"Did you do your homework?"],
        ["Tôi làm ở ___.","công ty",["bài tập","sách"],"I work at a company."],
        ["Em chào ___ ạ.","cô",["bút","lớp"],"Hello, teacher."]
      ]
    },

    { id:"u15", title:"At home", vi:"Ở nhà", color:"#C0432F", scene:"home",
      tip:"Phòng means room: phòng ngủ (bedroom), phòng tắm (bathroom), phòng khách (living room). Rửa bát (North) and rửa chén (South) both mean wash the dishes. Southerners say trên lầu for upstairs.",
      words:[
        ["phòng khách","living room"],["phòng ngủ","bedroom"],["nhà bếp","kitchen",["bếp"]],["phòng tắm","bathroom"],
        ["cửa","door"],["cửa sổ","window"],["bàn","table"],["ghế","chair"],["giường","bed"],
        ["tủ lạnh","fridge"],["nấu ăn","to cook"],["rửa bát","wash the dishes",["rửa chén"],"N"],
        ["quét nhà","sweep the floor"],["giặt đồ","do laundry",["giặt quần áo"]]
      ],
      phrases:[
        ["Má đang nấu ăn trong bếp.","Mom is cooking in the kitchen."],["Con đi rửa chén đi.","Go wash the dishes."],
        ["Phòng tôi ở trên lầu.","My room is upstairs."],["Con đóng cửa lại đi.","Close the door, please."],
        ["Nhà tôi có ba phòng ngủ.","My house has three bedrooms."],["Hôm nay tôi dọn dẹp nhà.","Today I clean the house."],
        ["Cơm ở trong tủ lạnh.","The rice is in the fridge."]
      ],
      fill:[
        ["Tôi ngủ trên ___.","giường",["cửa sổ","tủ lạnh"],"I sleep on the bed."],
        ["Nước ở trong ___.","tủ lạnh",["giường","cửa"],"The water is in the fridge."],
        ["Nhà tôi có ba phòng ___.","ngủ",["bàn","ghế"],"My house has three bedrooms."]
      ]
    },

    { id:"u16", title:"Tết and celebrations", vi:"Tết và lễ hội", color:"#B7791F", scene:"lanterns",
      tip:"Tết is the Lunar New Year. Kids wish their elders well, then get lì xì in red envelopes. Southern homes show yellow hoa mai and Northern homes pink hoa đào. Bánh chưng is square, and bánh tét is long and round.",
      words:[
        ["Tết","Lunar New Year"],["năm mới","new year"],["giao thừa","New Year's Eve"],["chúc","to wish"],
        ["lì xì","lucky money"],["bánh chưng","square rice cake",[],"N"],["bánh tét","log-shaped rice cake",[],"S"],
        ["mứt","candied fruit"],["hoa mai","yellow apricot blossom",[],"S"],["hoa đào","peach blossom",[],"N"],
        ["pháo hoa","fireworks"],["múa lân","lion dance"],["áo dài","áo dài (long dress)"],["Trung thu","Mid-Autumn Festival"]
      ],
      phrases:[
        ["Chúc mừng năm mới!","Happy New Year!"],["An khang thịnh vượng!","Peace and prosperity!"],
        ["Vạn sự như ý!","May all go as you wish!"],["Chúc ông bà sống lâu trăm tuổi.","Wishing you a long life, Grandma and Grandpa."],
        ["Con chúc ba má năm mới vui vẻ.","Happy New Year, Mom and Dad."],["Năm nay con được nhiều lì xì.","I got lots of lucky money this year."],
        ["Tết này bạn về quê không?","Are you going to your hometown this Tết?"],["Đêm giao thừa có pháo hoa.","There are fireworks on New Year's Eve."]
      ],
      fill:[
        ["Chúc mừng năm ___!","mới",["Tết","mứt"],"Happy New Year!"],
        ["Bà cho con ___.","lì xì",["năm mới","giao thừa"],"Grandma gives me lucky money."],
        ["Tết này tôi mặc ___.","áo dài",["bánh tét","mứt"],"This Tết I'm wearing an áo dài."]
      ]
    }
  ],

  STORIES: [
    { id:"s1", unit:"u1", title:"Meeting Lan", vi:"Gặp Lan", cast:{minh:"Minh", lan:"Lan"},
      lines:[
        {who:"minh", vi:"Chào em! Em tên là gì?", en:"Hi! What's your name?"},
        {who:"lan", vi:"Dạ, em tên là Lan. Còn anh?", en:"My name is Lan. And you?"},
        {who:"minh", vi:"Anh tên là Minh. Rất vui được gặp em.", en:"I'm Minh. Nice to meet you."},
        {who:"lan", vi:"Em cũng rất vui được gặp anh.", en:"Nice to meet you too."},
        {who:"minh", vi:"Em khỏe không?", en:"How are you?"},
        {who:"lan", vi:"Dạ, em khỏe. Cảm ơn anh.", en:"I'm well. Thank you."},
        {who:"minh", vi:"Hẹn gặp lại em nhé!", en:"See you again!"},
        {who:"lan", vi:"Dạ, tạm biệt anh!", en:"Bye!"}
      ],
      questions:[
        {after:1, q:"What is the girl's name?", opts:["Lan","Minh","Mai"], ans:"Lan"},
        {after:5, q:"How is Lan?", opts:["She's well","She's tired","She's sad"], ans:"She's well"}
      ]
    },

    { id:"s2", unit:"u2", title:"Family photo", vi:"Hình gia đình", cast:{bao:"Bảo", vy:"Vy"},
      lines:[
        {who:"bao", vi:"Đây là hình gia đình em hả?", en:"Is this your family photo?"},
        {who:"vy", vi:"Dạ, đúng rồi. Đây là ba má em.", en:"Yes, that's right. These are my parents."},
        {who:"bao", vi:"Còn đây là ai?", en:"And who is this?"},
        {who:"vy", vi:"Dạ, đây là anh trai em. Anh ấy hai mươi tuổi.", en:"This is my older brother. He's twenty."},
        {who:"bao", vi:"Gia đình em có mấy người?", en:"How many people are in your family?"},
        {who:"vy", vi:"Dạ, nhà em có năm người. Em còn có một em gái.", en:"My family has five people. I also have a younger sister."},
        {who:"bao", vi:"Em gái em mấy tuổi?", en:"How old is your little sister?"},
        {who:"vy", vi:"Dạ, em ấy mười tuổi.", en:"She's ten."}
      ],
      questions:[
        {after:1, q:"Who are \"ba má\"?", opts:["Her parents","Her grandparents","Her siblings"], ans:"Her parents"},
        {after:5, q:"How many people are in Vy's family?", opts:["Bốn","Năm","Sáu"], ans:"Năm"},
        {after:7, q:"How old is Vy's little sister?", opts:["10","20","15"], ans:"10"}
      ]
    },

    { id:"s3", unit:"u4", title:"At the pho shop", vi:"Ở tiệm phở", cast:{thao:"Thảo", nam:"Nam"},
      lines:[
        {who:"thao", vi:"Anh ăn gì ạ?", en:"What would you like to eat?"},
        {who:"nam", vi:"Cho anh một tô phở bò.", en:"A bowl of beef pho for me."},
        {who:"thao", vi:"Dạ. Anh uống gì không ạ?", en:"Okay. Anything to drink?"},
        {who:"nam", vi:"Cho anh một ly trà đá.", en:"An iced tea for me."},
        {who:"thao", vi:"Dạ, anh chờ một chút ạ.", en:"Please wait a moment."},
        {who:"nam", vi:"Phở ngon quá!", en:"The pho is so good!"},
        {who:"nam", vi:"Em ơi, tính tiền.", en:"Excuse me, the check please."},
        {who:"thao", vi:"Dạ, sáu mươi lăm nghìn ạ.", en:"That's 65,000 dong."}
      ],
      questions:[
        {after:1, q:"What does Nam order?", opts:["Phở bò","Phở gà","Cơm"], ans:"Phở bò"},
        {after:3, q:"What does Nam drink?", opts:["Iced tea","Coffee","Water"], ans:"Iced tea"},
        {after:7, q:"How much is the bill?", opts:["65,000 đồng","55,000 đồng","75,000 đồng"], ans:"65,000 đồng"}
      ]
    },

    { id:"s4", unit:"u5", title:"Back in Vietnam", vi:"Về Việt Nam", cast:{hoa:"Cô Hoa", kim:"Kim"},
      lines:[
        {who:"hoa", vi:"Con từ đâu tới vậy?", en:"Where are you from?"},
        {who:"kim", vi:"Dạ, con ở Mỹ ạ.", en:"I'm from America."},
        {who:"hoa", vi:"Con về Việt Nam khi nào?", en:"When did you come back to Vietnam?"},
        {who:"kim", vi:"Dạ, con về hôm qua.", en:"I came back yesterday."},
        {who:"hoa", vi:"Con nói tiếng Việt giỏi quá!", en:"You speak Vietnamese so well!"},
        {who:"kim", vi:"Dạ, con cảm ơn cô. Má con dạy con.", en:"Thank you. My mom taught me."},
        {who:"kim", vi:"Cô ơi, nhà vệ sinh ở đâu ạ?", en:"Excuse me, where is the restroom?"},
        {who:"hoa", vi:"Ở đằng kia đó con.", en:"It's over there."}
      ],
      questions:[
        {after:1, q:"Where is Kim from?", opts:["America","Vietnam","France"], ans:"America"},
        {after:3, q:"When did Kim arrive?", opts:["Yesterday","Today","Tomorrow"], ans:"Yesterday"},
        {after:5, q:"Who taught Kim Vietnamese?", opts:["Her mom","Her teacher","Her friend"], ans:"Her mom"}
      ]
    },

    { id:"s5", unit:"u7", title:"A long day", vi:"Một ngày dài", cast:{linh:"Linh", tu:"Tú"},
      lines:[
        {who:"linh", vi:"Em sao vậy? Em buồn hả?", en:"What's wrong? Are you sad?"},
        {who:"tu", vi:"Dạ không. Em mệt quá.", en:"No. I'm so tired."},
        {who:"linh", vi:"Hôm nay em học nhiều hả?", en:"Did you study a lot today?"},
        {who:"tu", vi:"Dạ, em học cả ngày. Em đói nữa.", en:"Yes, I studied all day. I'm hungry too."},
        {who:"linh", vi:"Chị nấu mì cho em nhé?", en:"Want me to make you some noodles?"},
        {who:"tu", vi:"Dạ, em cảm ơn chị! Em thương chị.", en:"Thank you! I love you."},
        {who:"linh", vi:"Ăn xong rồi đi ngủ sớm nha.", en:"After you eat, go to bed early, okay?"},
        {who:"tu", vi:"Dạ. Giờ em vui rồi!", en:"Okay. Now I'm happy!"}
      ],
      questions:[
        {after:1, q:"How does Tú feel?", opts:["Tired","Angry","Scared"], ans:"Tired"},
        {after:4, q:"What does Linh offer to cook?", opts:["Noodles","Pho","Rice"], ans:"Noodles"},
        {after:7, q:"How does Tú feel at the end?", opts:["Happy","Sad","Hungry"], ans:"Happy"}
      ]
    },

    { id:"s6", unit:"u10", title:"Bargaining", vi:"Trả giá", cast:{mai:"Mai", hanh:"Chị Hạnh"},
      lines:[
        {who:"mai", vi:"Chị ơi, cái áo này bao nhiêu tiền?", en:"Excuse me, how much is this shirt?"},
        {who:"hanh", vi:"Hai trăm nghìn em.", en:"Two hundred thousand."},
        {who:"mai", vi:"Đắt quá! Chị bớt cho em đi.", en:"Too expensive! Please lower the price."},
        {who:"hanh", vi:"Vậy một trăm tám mươi nghìn nhé.", en:"Okay, one hundred eighty thousand then."},
        {who:"mai", vi:"Một trăm rưỡi được không chị?", en:"How about one hundred fifty?"},
        {who:"hanh", vi:"Thôi được, chị bán cho em.", en:"Fine, I'll sell it to you."},
        {who:"mai", vi:"Em trả bằng thẻ được không?", en:"Can I pay by card?"},
        {who:"hanh", vi:"Không được em, chỉ nhận tiền mặt thôi.", en:"No, cash only."}
      ],
      questions:[
        {after:1, q:"What is the first price?", opts:["200,000 đồng","150,000 đồng","180,000 đồng"], ans:"200,000 đồng"},
        {after:5, q:"What price do they agree on?", opts:["150,000 đồng","180,000 đồng","200,000 đồng"], ans:"150,000 đồng"},
        {after:7, q:"How does Mai have to pay?", opts:["Cash","Card","Grab"], ans:"Cash"}
      ]
    },

    { id:"s7", unit:"u11", title:"Taking a Grab", vi:"Đi Grab", cast:{chu:"Chú Tư", ha:"Hà"},
      lines:[
        {who:"chu", vi:"Con đi đâu?", en:"Where are you going?"},
        {who:"ha", vi:"Dạ, con đi khách sạn Sao Mai ạ.", en:"To the Sao Mai Hotel."},
        {who:"chu", vi:"Khách sạn đó ở đường nào con?", en:"Which street is that hotel on?"},
        {who:"ha", vi:"Dạ, đường Lê Lợi. Có xa không chú?", en:"Lê Lợi Street. Is it far?"},
        {who:"chu", vi:"Không xa đâu, mười phút thôi.", en:"Not far, only ten minutes."},
        {who:"ha", vi:"Tới ngã tư chú quẹo trái giùm con nha.", en:"At the intersection, please turn left."},
        {who:"chu", vi:"Tới rồi đó con.", en:"We're here."},
        {who:"ha", vi:"Dạ, con cảm ơn chú!", en:"Thank you!"}
      ],
      questions:[
        {after:1, q:"Where is Hà going?", opts:["A hotel","The airport","School"], ans:"A hotel"},
        {after:4, q:"How long is the ride?", opts:["10 minutes","1 hour","5 minutes"], ans:"10 minutes"},
        {after:5, q:"Which way should the driver turn?", opts:["Left","Right","Straight"], ans:"Left"}
      ]
    },

    { id:"s8", unit:"u16", title:"Tết at Grandma's", vi:"Tết ở nhà bà", cast:{bin:"Bin", ba:"Bà"},
      lines:[
        {who:"bin", vi:"Con chúc bà năm mới sống lâu trăm tuổi!", en:"Happy New Year, Grandma! I wish you a long life!"},
        {who:"ba", vi:"Cảm ơn con. Bà chúc con học giỏi nha.", en:"Thank you. I wish you good grades."},
        {who:"ba", vi:"Đây, bà lì xì cho con.", en:"Here, some lucky money for you."},
        {who:"bin", vi:"Dạ, con cảm ơn bà!", en:"Thank you, Grandma!"},
        {who:"ba", vi:"Con ăn bánh tét chưa?", en:"Have you had bánh tét yet?"},
        {who:"bin", vi:"Dạ chưa. Bánh tét của bà ngon nhất!", en:"Not yet. Your bánh tét is the best!"},
        {who:"ba", vi:"Tối nay mình đi coi pháo hoa nha.", en:"Tonight let's go watch the fireworks."},
        {who:"bin", vi:"Dạ! Con thích Tết quá!", en:"Yay! I love Tết so much!"}
      ],
      questions:[
        {after:2, q:"What does Grandma give Bin?", opts:["Lucky money","Bánh tét","An áo dài"], ans:"Lucky money"},
        {after:5, q:"Which Tết food do they talk about?", opts:["Bánh tét","Bánh chưng","Phở"], ans:"Bánh tét"},
        {after:7, q:"What will they do tonight?", opts:["Watch fireworks","See a lion dance","Go to school"], ans:"Watch fireworks"}
      ]
    }
 ,
    { id:"s9", unit:"u3", title:"How old are you?", vi:"Em mấy tuổi?", cast:{an:"An", kim:"Kim"},
      lines:[
        {who:"an", vi:"Chị Kim ơi, chị bao nhiêu tuổi?", en:"Kim, how old are you?"},
        {who:"kim", vi:"Chị hai mươi mốt tuổi. Còn em?", en:"I'm twenty-one. And you?"},
        {who:"an", vi:"Dạ, em mười lăm tuổi.", en:"I'm fifteen."},
        {who:"kim", vi:"Số điện thoại của em là bao nhiêu?", en:"What's your phone number?"},
        {who:"an", vi:"Dạ, không chín không ba, bốn năm sáu, bảy tám chín.", en:"It's 0903 456 789."},
        {who:"kim", vi:"Tối nay chị gọi em nha.", en:"I'll call you tonight."},
        {who:"an", vi:"Chị ở Việt Nam mấy ngày?", en:"How many days are you staying in Vietnam?"},
        {who:"kim", vi:"Chị ở mười ngày.", en:"Ten days."},
        {who:"an", vi:"Ít quá! Chị ở một trăm ngày đi!", en:"That's so short! Stay a hundred days!"}
      ],
      questions:[
        {after:1, q:"How old is Kim?", opts:["21","12","31"], ans:"21"},
        {after:2, q:"How old is An?", opts:["15","5","50"], ans:"15"},
        {after:7, q:"How long is Kim staying?", opts:["10 days","100 days","10 weeks"], ans:"10 days"}
      ]
    },

    { id:"s10", unit:"u6", title:"Mom's morning call", vi:"Má gọi buổi sáng", cast:{ma:"Má", huy:"Huy"},
      lines:[
        {who:"ma", vi:"Huy ơi, con dậy chưa?", en:"Huy, are you up yet?"},
        {who:"huy", vi:"Dạ, con dậy rồi má.", en:"Yes, I'm up, Mom."},
        {who:"ma", vi:"Bây giờ là bảy giờ rồi. Con ăn sáng chưa?", en:"It's already seven. Have you had breakfast?"},
        {who:"huy", vi:"Dạ chưa. Con đang tắm.", en:"Not yet. I'm taking a shower."},
        {who:"ma", vi:"Hôm nay con đi học hay đi làm?", en:"Are you going to school or to work today?"},
        {who:"huy", vi:"Dạ, sáng con đi học, chiều con làm việc.", en:"School in the morning, work in the afternoon."},
        {who:"ma", vi:"Tối nay con về nhà ăn cơm nha.", en:"Come home for dinner tonight, okay?"},
        {who:"huy", vi:"Dạ, con về lúc sáu giờ.", en:"Okay, I'll be home at six."}
      ],
      questions:[
        {after:3, q:"What is Huy doing right now?", opts:["Showering","Eating breakfast","Sleeping"], ans:"Showering"},
        {after:5, q:"What does Huy do in the afternoon?", opts:["Works","Studies","Sleeps"], ans:"Works"},
        {after:7, q:"When will Huy come home?", opts:["6:00","7:00","8:00"], ans:"6:00"}
      ]
    },

    { id:"s11", unit:"u8", title:"Two áo dài", vi:"Hai cái áo dài", cast:{nga:"Cô Nga", my:"My"},
      lines:[
        {who:"nga", vi:"Con thích màu gì?", en:"What color do you like?"},
        {who:"my", vi:"Dạ, con thích màu xanh dương.", en:"I like blue."},
        {who:"nga", vi:"Áo dài này màu xanh dương nè. Đẹp không?", en:"This áo dài is blue. Isn't it pretty?"},
        {who:"my", vi:"Đẹp quá! Nhưng má con thích màu đỏ.", en:"So pretty! But my mom likes red."},
        {who:"nga", vi:"Áo màu đỏ cũng có. Còn có màu hồng nữa.", en:"We have red too. And pink."},
        {who:"my", vi:"Con lấy áo xanh cho con, áo đỏ cho má.", en:"I'll take the blue one for me and the red one for Mom."},
        {who:"nga", vi:"Hai cái áo đẹp lắm. Mặc đi Tết nha!", en:"They're both beautiful. Wear them for Tết!"},
        {who:"my", vi:"Dạ, con cảm ơn cô!", en:"Thank you!"}
      ],
      questions:[
        {after:1, q:"What color does My like?", opts:["Blue","Red","Pink"], ans:"Blue"},
        {after:3, q:"What color does My's mom like?", opts:["Red","Purple","White"], ans:"Red"},
        {after:5, q:"How many áo dài does My buy?", opts:["Two","One","Three"], ans:"Two"}
      ]
    },

    { id:"s12", unit:"u9", title:"Grandpa's birthday", vi:"Sinh nhật ông ngoại", cast:{kim:"Kim", ong:"Ông ngoại"},
      lines:[
        {who:"kim", vi:"Ông ngoại ơi, sinh nhật ông là ngày nào?", en:"Grandpa, when is your birthday?"},
        {who:"ong", vi:"Thứ bảy tuần sau, ngày mười hai tháng ba.", en:"Next Saturday, March 12."},
        {who:"kim", vi:"Năm nay ông bao nhiêu tuổi ạ?", en:"How old are you turning this year?"},
        {who:"ong", vi:"Ông tám mươi tuổi rồi con.", en:"I'm eighty now."},
        {who:"kim", vi:"Mấy giờ mình ăn tiệc ạ?", en:"What time is the party?"},
        {who:"ong", vi:"Sáu giờ rưỡi tối. Con tới sớm nha.", en:"Six thirty in the evening. Come early."},
        {who:"kim", vi:"Dạ, con tới lúc năm giờ.", en:"Okay, I'll come at five."},
        {who:"ong", vi:"Giỏi quá! Ông chờ con.", en:"Wonderful! I'll be waiting for you."}
      ],
      questions:[
        {after:1, q:"When is Grandpa's birthday?", opts:["Next Saturday","Next Sunday","Tomorrow"], ans:"Next Saturday"},
        {after:3, q:"How old is Grandpa turning?", opts:["80","70","90"], ans:"80"},
        {after:5, q:"What time is the party?", opts:["6:30 p.m.","5:00 p.m.","6:30 a.m."], ans:"6:30 p.m."}
      ]
    },

    { id:"s13", unit:"u12", title:"Rainy season", vi:"Mùa mưa", cast:{khoa:"Khoa", huong:"Hương"},
      lines:[
        {who:"khoa", vi:"Hôm nay trời nóng quá!", en:"It's so hot today!"},
        {who:"huong", vi:"Dạ, nhưng chiều nay trời sẽ mưa.", en:"Yes, but it's going to rain this afternoon."},
        {who:"khoa", vi:"Thật hả? Trời đang nắng đẹp mà.", en:"Really? It's sunny and nice right now."},
        {who:"huong", vi:"Mùa mưa ở Sài Gòn là vậy đó. Sáng nắng, chiều mưa.", en:"That's rainy season in Saigon. Sunny mornings, rainy afternoons."},
        {who:"khoa", vi:"Ở Mỹ, chỗ anh ở mùa đông lạnh lắm.", en:"Where I live in America, winter is really cold."},
        {who:"huong", vi:"Em chưa thấy tuyết bao giờ.", en:"I've never seen snow."},
        {who:"khoa", vi:"Mùa đông năm nay em qua Mỹ chơi đi!", en:"Come visit America this winter!"},
        {who:"huong", vi:"Dạ! Nhưng bây giờ anh mang áo mưa nhé.", en:"Okay! But for now, bring a raincoat."}
      ],
      questions:[
        {after:1, q:"What will the weather be this afternoon?", opts:["Rainy","Sunny","Cold"], ans:"Rainy"},
        {after:3, q:"What is rainy season like in Saigon?", opts:["Sunny mornings, rainy afternoons","Rain all day","Cold and windy"], ans:"Sunny mornings, rainy afternoons"},
        {after:7, q:"What should Khoa bring?", opts:["A raincoat","A hat","A fan"], ans:"A raincoat"}
      ]
    },

    { id:"s14", unit:"u13", title:"At the pharmacy", vi:"Ở nhà thuốc", cast:{thu:"Chị Thu", duc:"Đức"},
      lines:[
        {who:"thu", vi:"Em bị sao vậy?", en:"What's wrong?"},
        {who:"duc", vi:"Dạ, em bị đau đầu và ho.", en:"I have a headache and a cough."},
        {who:"thu", vi:"Em có bị sốt không?", en:"Do you have a fever?"},
        {who:"duc", vi:"Dạ, hôm qua em sốt một chút.", en:"I had a little fever yesterday."},
        {who:"thu", vi:"Đây là thuốc. Mỗi ngày uống ba lần, sau khi ăn.", en:"Here's the medicine. Three times a day, after meals."},
        {who:"duc", vi:"Bao nhiêu tiền vậy chị?", en:"How much is it?"},
        {who:"thu", vi:"Năm mươi nghìn. Ba ngày không đỡ thì em đi gặp bác sĩ nha.", en:"Fifty thousand. If you're not better in three days, go see a doctor."},
        {who:"duc", vi:"Dạ, em cảm ơn chị.", en:"Thank you."},
        {who:"thu", vi:"Chúc em mau khỏe!", en:"Get well soon!"}
      ],
      questions:[
        {after:1, q:"What's wrong with Đức?", opts:["Headache and cough","Stomachache","Toothache"], ans:"Headache and cough"},
        {after:4, q:"How often should he take the medicine?", opts:["3 times a day","Once a day","Twice a day"], ans:"3 times a day"},
        {after:6, q:"How much does it cost?", opts:["50,000 đồng","15,000 đồng","500,000 đồng"], ans:"50,000 đồng"}
      ]
    },

    { id:"s15", unit:"u14", title:"Saturday Vietnamese class", vi:"Lớp tiếng Việt thứ bảy", cast:{loan:"Cô Loan", tam:"Tâm"},
      lines:[
        {who:"loan", vi:"Chào các em. Cô tên là Loan.", en:"Hello, everyone. My name is Loan."},
        {who:"tam", vi:"Em chào cô ạ.", en:"Hello, teacher."},
        {who:"loan", vi:"Em tên gì? Em là học sinh hay sinh viên?", en:"What's your name? Are you in high school or college?"},
        {who:"tam", vi:"Dạ, em tên là Tâm. Em là sinh viên năm nhất.", en:"My name is Tâm. I'm a first-year college student."},
        {who:"loan", vi:"Sao em học tiếng Việt?", en:"Why are you learning Vietnamese?"},
        {who:"tam", vi:"Dạ, em muốn nói chuyện với bà ngoại.", en:"I want to be able to talk with my grandma."},
        {who:"loan", vi:"Hay quá! Đây là sách và bài tập của em.", en:"That's wonderful! Here's your book and homework."},
        {who:"tam", vi:"Dạ. Thứ bảy tuần sau mình có thi không cô?", en:"Is there a test next Saturday?"},
        {who:"loan", vi:"Không có thi. Em đừng lo!", en:"No test. Don't worry!"}
      ],
      questions:[
        {after:3, q:"Is Tâm in high school or college?", opts:["College","High school","Neither, Tâm works"], ans:"College"},
        {after:5, q:"Why is Tâm learning Vietnamese?", opts:["To talk with Grandma","For a job","For a test"], ans:"To talk with Grandma"},
        {after:8, q:"Is there a test next Saturday?", opts:["No","Yes","On Sunday"], ans:"No"}
      ]
    },

    { id:"s16", unit:"u15", title:"Grandma is coming", vi:"Bà ngoại tới chơi", cast:{ma:"Má", han:"Hân"},
      lines:[
        {who:"ma", vi:"Hân ơi, chiều nay bà ngoại tới chơi.", en:"Hân, Grandma is coming over this afternoon."},
        {who:"han", vi:"Dạ! Con giúp gì được má?", en:"Yay! How can I help, Mom?"},
        {who:"ma", vi:"Con quét nhà với dọn phòng khách đi.", en:"Sweep the floor and tidy up the living room."},
        {who:"han", vi:"Dạ. Còn rửa chén thì sao má?", en:"Okay. What about the dishes?"},
        {who:"ma", vi:"Anh Hai rửa chén rồi. Con mở cửa sổ ra cho mát.", en:"Your oldest brother already did them. Open the windows to cool the place down."},
        {who:"han", vi:"Má ơi, trái cây ở đâu vậy?", en:"Mom, where's the fruit?"},
        {who:"ma", vi:"Trái cây ở trong tủ lạnh.", en:"The fruit is in the fridge."},
        {who:"han", vi:"Con để trái cây trên bàn nha.", en:"I'll put the fruit on the table."},
        {who:"ma", vi:"Giỏi quá! Bà ngoại sẽ vui lắm.", en:"Great job! Grandma will be so happy."}
      ],
      questions:[
        {after:0, q:"Who is coming over?", opts:["Grandma","An uncle","A teacher"], ans:"Grandma"},
        {after:4, q:"Who washed the dishes? (In the South, anh Hai is the oldest brother.)", opts:["Her oldest brother","Hân","Mom"], ans:"Her oldest brother"},
        {after:6, q:"Where is the fruit?", opts:["In the fridge","On the table","In the bedroom"], ans:"In the fridge"}
      ]
    }
  ],

  NUMBERS: {0:"không",1:"một",2:"hai",3:"ba",4:"bốn",5:"năm",6:"sáu",7:"bảy",8:"tám",9:"chín",10:"mười"}
};
