from tensorflow.keras.datasets import mnist
import matplotlib.pyplot as plt

(X_train, y_train), (X_test, y_test) = mnist.load_data()

# Normalize Inputs from 0–255 to 0–1
x_train = x_train / 255
x_test = x_test / 255
# One-Hot Encode outputs
y_train = np_utils.to_categorical(y_train)
y_test = np_utils.to_categorical(y_test)
num_classes = 10

x_train_simple = x_train.reshape(60000, 28 * 28).astype('float32')
x_train_simple = x_train.reshape(60000, 28 * 28).astype('float32')
model = Sequential()
model.add(Dense(28 * 28, input_dim=28 * 28, activation='relu'))
model.add(Dense(num_classes, activation='softmax'))
model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
model.fit(x_train_simple, y_train, validation_data=(x_test_simple, y_test), epochs=30, batch_size=200, verbose=2)
model.save("model.h5")


